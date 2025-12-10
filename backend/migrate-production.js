// Run this to migrate production database
// Usage: node migrate-production.js <your-database-url>

const { Pool } = require('pg');

const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: Please provide database URL');
  console.log('Usage: node migrate-production.js "postgresql://user:pass@host:port/db"');
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('🔄 Starting migration...\n');

    // Add qr_code to tables
    await pool.query(`
      ALTER TABLE tables 
      ADD COLUMN IF NOT EXISTS qr_code TEXT
    `);
    console.log('✅ Added qr_code to tables');

    // Add payment fields to orders
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
      ADD COLUMN IF NOT EXISTS payment_slip TEXT,
      ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Added payment fields to orders');

    // Add timestamps to order_items
    await pool.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS received_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS cooking_started_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS cooked_at TIMESTAMP
    `);
    console.log('✅ Added cooking timestamps to order_items');

    console.log('\n🎉 Migration completed successfully!');
    
    // Verify columns exist
    console.log('\n📋 Verifying columns...');
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('tables', 'orders', 'order_items')
      AND column_name IN ('qr_code', 'payment_method', 'payment_slip', 'payment_verified', 
                          'received_at', 'cooking_started_at', 'cooked_at')
      ORDER BY table_name, column_name
    `);
    
    console.log('\nColumns added:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
