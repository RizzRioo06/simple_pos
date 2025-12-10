const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name_mm as category_name_mm,
        c.name_en as category_name_en
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.available = true
      ORDER BY c.id, p.name_mm
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search products (supports Burmese Unicode)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name_mm as category_name_mm,
        c.name_en as category_name_en
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.available = true 
        AND (
          p.name_mm ILIKE $1 
          OR p.name_en ILIKE $1
        )
      ORDER BY p.name_mm
      LIMIT 20
    `, [`%${q}%`]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name_mm as category_name_mm,
        c.name_en as category_name_en
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
