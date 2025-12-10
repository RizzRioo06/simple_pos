const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all tables with current order info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.table_number,
        t.status,
        COALESCE(o.total_amount, 0) as current_bill,
        o.id as order_id
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status = 'OPEN'
      ORDER BY t.table_number
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single table details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        t.id,
        t.table_number,
        t.status,
        COALESCE(o.total_amount, 0) as current_bill,
        o.id as order_id
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status = 'OPEN'
      WHERE t.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update table status
router.patch('/:id/status', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await client.query('BEGIN');
    
    const result = await client.query(
      'UPDATE tables SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating table status:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
