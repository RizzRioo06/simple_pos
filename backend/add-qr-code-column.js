const pool = require('./config/database');

const addQRCodeColumn = async () => {
  try {
    console.log('Adding qr_code column to tables table...');
    
    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tables' AND column_name='qr_code'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('qr_code column already exists!');
      process.exit(0);
    }
    
    // Add the column
    await pool.query(`
      ALTER TABLE tables 
      ADD COLUMN qr_code TEXT
    `);
    
    console.log('Successfully added qr_code column to tables table!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding qr_code column:', error);
    process.exit(1);
  }
};

addQRCodeColumn();
