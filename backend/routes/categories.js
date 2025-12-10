const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all categories with products
router.get('/with-products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id as category_id,
        c.name_mm as category_name_mm,
        c.name_en as category_name_en,
        json_agg(
          json_build_object(
            'id', p.id,
            'name_mm', p.name_mm,
            'name_en', p.name_en,
            'price', p.price,
            'available', p.available
          ) ORDER BY p.name_mm
        ) as products
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE p.available = true
      GROUP BY c.id, c.name_mm, c.name_en
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
