const pool = require('./config/database');

const addMissingColumns = async () => {
  try {
    console.log('Starting database migration - adding missing columns...');
    
    // Add qr_code to tables table
    const checkQRCode = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tables' AND column_name='qr_code'
    `);
    
    if (checkQRCode.rows.length === 0) {
      await pool.query(`ALTER TABLE tables ADD COLUMN qr_code TEXT`);
      console.log('✓ Added qr_code column to tables table');
    } else {
      console.log('✓ qr_code column already exists in tables table');
    }
    
    // Add received_at to order_items table
    const checkReceivedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='order_items' AND column_name='received_at'
    `);
    
    if (checkReceivedAt.rows.length === 0) {
      await pool.query(`ALTER TABLE order_items ADD COLUMN received_at TIMESTAMP`);
      console.log('✓ Added received_at column to order_items table');
    } else {
      console.log('✓ received_at column already exists in order_items table');
    }
    
    // Add cooking_started_at to order_items table
    const checkCookingStarted = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='order_items' AND column_name='cooking_started_at'
    `);
    
    if (checkCookingStarted.rows.length === 0) {
      await pool.query(`ALTER TABLE order_items ADD COLUMN cooking_started_at TIMESTAMP`);
      console.log('✓ Added cooking_started_at column to order_items table');
    } else {
      console.log('✓ cooking_started_at column already exists in order_items table');
    }
    
    // Add cooked_at to order_items table
    const checkCookedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='order_items' AND column_name='cooked_at'
    `);
    
    if (checkCookedAt.rows.length === 0) {
      await pool.query(`ALTER TABLE order_items ADD COLUMN cooked_at TIMESTAMP`);
      console.log('✓ Added cooked_at column to order_items table');
    } else {
      console.log('✓ cooked_at column already exists in order_items table');
    }
    
    // Add served_at to order_items table
    const checkServedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='order_items' AND column_name='served_at'
    `);
    
    if (checkServedAt.rows.length === 0) {
      await pool.query(`ALTER TABLE order_items ADD COLUMN served_at TIMESTAMP`);
      console.log('✓ Added served_at column to order_items table');
    } else {
      console.log('✓ served_at column already exists in order_items table');
    }
    
    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database migration:', error);
    process.exit(1);
  }
};

addMissingColumns();
