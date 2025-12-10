const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create new order or get existing open order for table
router.post('/start', async (req, res) => {
  const client = await pool.connect();
  try {
    const { table_id } = req.body;
    
    await client.query('BEGIN');
    
    // Check if table already has an open order
    let orderResult = await client.query(
      'SELECT * FROM orders WHERE table_id = $1 AND status = $2',
      [table_id, 'OPEN']
    );
    
    if (orderResult.rows.length === 0) {
      // Create new order
      orderResult = await client.query(
        'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING *',
        [table_id, 'OPEN']
      );
      
      // Update table status to OCCUPIED
      await client.query(
        'UPDATE tables SET status = $1 WHERE id = $2',
        ['OCCUPIED', table_id]
      );
    }
    
    await client.query('COMMIT');
    res.json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error starting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get order details with items
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order details
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items
    const itemsResult = await pool.query(`
      SELECT 
        oi.*,
        p.name_mm,
        p.name_en
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `, [id]);
    
    const order = orderResult.rows[0];
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add items to order
router.post('/:id/items', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { items } = req.body; // Array of { product_id, quantity }
    
    await client.query('BEGIN');
    
    const addedItems = [];
    
    for (const item of items) {
      // Get product price
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      
      const price = productResult.rows[0].price;
      
      // Add order item
      const itemResult = await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, item.product_id, item.quantity, price, 'PENDING']
      );
      
      addedItems.push(itemResult.rows[0]);
    }
    
    // Update order total
    const totalResult = await client.query(`
      SELECT COALESCE(SUM(quantity * price), 0) as total
      FROM order_items
      WHERE order_id = $1
    `, [id]);
    
    await client.query(
      'UPDATE orders SET total_amount = $1 WHERE id = $2',
      [totalResult.rows[0].total, id]
    );
    
    await client.query('COMMIT');
    res.json({ message: 'Items added successfully', items: addedItems });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding items to order:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get kitchen view (pending items)
router.get('/kitchen/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.status,
        oi.created_at,
        p.name_mm,
        p.name_en,
        t.table_number,
        o.id as order_id
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      JOIN tables t ON o.table_id = t.id
      WHERE oi.status = 'PENDING' AND o.status = 'OPEN'
      ORDER BY oi.created_at
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kitchen items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark item as served
router.patch('/items/:itemId/serve', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const result = await pool.query(
      'UPDATE order_items SET status = $1, served_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['SERVED', itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking item as served:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Checkout - Get order summary
router.get('/:id/checkout', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query(`
      SELECT 
        o.*,
        t.table_number
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      WHERE o.id = $1
    `, [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const itemsResult = await pool.query(`
      SELECT 
        oi.quantity,
        oi.price,
        p.name_mm,
        p.name_en
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);
    
    const order = orderResult.rows[0];
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (error) {
    console.error('Error getting checkout info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete order and close table
router.post('/:id/complete', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Get order info
    const orderResult = await client.query(
      'SELECT table_id FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }
    
    const tableId = orderResult.rows[0].table_id;
    
    // Update order status
    await client.query(
      'UPDATE orders SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['COMPLETED', id]
    );
    
    // Free the table
    await client.query(
      'UPDATE tables SET status = $1 WHERE id = $2',
      ['FREE', tableId]
    );
    
    await client.query('COMMIT');
    res.json({ message: 'Order completed and table closed successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error completing order:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
