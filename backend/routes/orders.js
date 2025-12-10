const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Customer: Create new order for table
router.post('/start', async (req, res) => {
  const client = await pool.connect();
  try {
    const { table_id } = req.body;
    
    await client.query('BEGIN');
    
    // Check if table already has a pending order
    let orderResult = await client.query(
      'SELECT * FROM orders WHERE table_id = $1 AND status IN ($2, $3, $4, $5, $6)',
      [table_id, 'PENDING', 'RECEIVED', 'COOKING', 'DONE', 'SERVED']
    );
    
    if (orderResult.rows.length === 0) {
      // Create new order
      orderResult = await client.query(
        'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING *',
        [table_id, 'PENDING']
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
        oi.received_at,
        oi.cooking_started_at,
        oi.cooked_at,
        p.name_mm,
        p.name_en,
        t.table_number,
        o.id as order_id
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      JOIN tables t ON o.table_id = t.id
      WHERE oi.status IN ('PENDING', 'RECEIVED', 'COOKING', 'DONE')
      ORDER BY oi.created_at
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kitchen items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kitchen: Receive order (acknowledge)
router.patch('/items/:itemId/receive', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const result = await pool.query(
      'UPDATE order_items SET status = $1, received_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['RECEIVED', itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error receiving item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kitchen: Start cooking
router.patch('/items/:itemId/start-cooking', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const result = await pool.query(
      'UPDATE order_items SET status = $1, cooking_started_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['COOKING', itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error starting cooking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kitchen: Mark as done cooking
router.patch('/items/:itemId/done-cooking', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const result = await pool.query(
      'UPDATE order_items SET status = $1, cooked_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['DONE', itemId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking as done:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Waiter: Get orders ready to serve
router.get('/waiter/ready-to-serve', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id as order_id,
        o.table_id,
        t.table_number,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name_mm', p.name_mm,
            'product_name_en', p.name_en,
            'quantity', oi.quantity,
            'status', oi.status
          )
        ) as items
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE oi.status = 'DONE'
      GROUP BY o.id, o.table_id, t.table_number
      ORDER BY o.created_at
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ready orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Waiter: Mark item as served
router.patch('/items/:itemId/serve', async (req, res) => {
  const client = await pool.connect();
  try {
    const { itemId } = req.params;
    
    await client.query('BEGIN');
    
    const result = await client.query(
      'UPDATE order_items SET status = $1, served_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['SERVED', itemId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Order item not found');
    }
    
    const orderId = result.rows[0].order_id;
    
    // Check if all items are served
    const allServedResult = await client.query(
      'SELECT COUNT(*) as count FROM order_items WHERE order_id = $1 AND status != $2',
      [orderId, 'SERVED']
    );
    
    if (allServedResult.rows[0].count === '0') {
      // Update order status to SERVED
      await client.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['SERVED', orderId]
      );
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error marking item as served:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
});

// Cashier: Get all served orders waiting for payment
router.get('/cashier/pending-payment', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.table_id,
        o.total_amount,
        o.status,
        o.created_at,
        t.table_number,
        json_agg(
          json_build_object(
            'product_name_mm', p.name_mm,
            'product_name_en', p.name_en,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN tables t ON o.table_id = t.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'SERVED'
      GROUP BY o.id, o.table_id, o.total_amount, o.status, o.created_at, t.table_number
      ORDER BY o.created_at
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer: Submit payment slip
router.post('/:id/submit-payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, payment_slip } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET payment_method = $1, payment_slip = $2 WHERE id = $3 RETURNING *',
      [payment_method, payment_slip, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cashier: Verify payment and complete order
router.post('/:id/verify-payment', async (req, res) => {
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
    
    // Update order status to PAID
    await client.query(
      'UPDATE orders SET status = $1, payment_verified = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['PAID', true, id]
    );
    
    // Keep table as OCCUPIED until waiter cleans it
    
    await client.query('COMMIT');
    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
});

// Waiter: Clean table after payment
router.post('/tables/:tableId/clean', async (req, res) => {
  try {
    const { tableId } = req.params;
    
    await pool.query(
      'UPDATE tables SET status = $1 WHERE id = $2',
      ['FREE', tableId]
    );
    
    res.json({ message: 'Table cleaned and freed successfully' });
  } catch (error) {
    console.error('Error cleaning table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
