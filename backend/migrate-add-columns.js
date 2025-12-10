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
    
    // Add payment_method to orders table
    const checkPaymentMethod = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='payment_method'
    `);
    
    if (checkPaymentMethod.rows.length === 0) {
      await pool.query(`ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20)`);
      console.log('✓ Added payment_method column to orders table');
    } else {
      console.log('✓ payment_method column already exists in orders table');
    }
    
    // Add payment_slip to orders table
    const checkPaymentSlip = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='payment_slip'
    `);
    
    if (checkPaymentSlip.rows.length === 0) {
      await pool.query(`ALTER TABLE orders ADD COLUMN payment_slip TEXT`);
      console.log('✓ Added payment_slip column to orders table');
    } else {
      console.log('✓ payment_slip column already exists in orders table');
    }
    
    // Add payment_verified to orders table
    const checkPaymentVerified = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='payment_verified'
    `);
    
    if (checkPaymentVerified.rows.length === 0) {
      await pool.query(`ALTER TABLE orders ADD COLUMN payment_verified BOOLEAN DEFAULT false`);
      console.log('✓ Added payment_verified column to orders table');
    } else {
      console.log('✓ payment_verified column already exists in orders table');
    }
    
    // Add completed_at to orders table
    const checkCompletedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='completed_at'
    `);
    
    if (checkCompletedAt.rows.length === 0) {
      await pool.query(`ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP`);
      console.log('✓ Added completed_at column to orders table');
    } else {
      console.log('✓ completed_at column already exists in orders table');
    }
    
    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database migration:', error);
    process.exit(1);
  }
};

addMissingColumns();
