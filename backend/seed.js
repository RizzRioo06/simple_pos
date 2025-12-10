const pool = require('./config/database');
const { createTables } = require('./config/schema');

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE categories, products, tables, orders, order_items RESTART IDENTITY CASCADE');

    // Insert Categories
    const categories = [
      { name_mm: 'လက်ဖက်ရည်', name_en: 'Tea' },
      { name_mm: 'အအေးနှင့်ကော်ဖီ', name_en: 'Coffee & Drinks' },
      { name_mm: 'အဆာပြေ', name_en: 'Snacks' },
      { name_mm: 'မနက်စာ', name_en: 'Noodles & Main' },
      { name_mm: 'အချိုပွဲ', name_en: 'Dessert' }
    ];

    for (const cat of categories) {
      await client.query(
        'INSERT INTO categories (name_mm, name_en) VALUES ($1, $2)',
        [cat.name_mm, cat.name_en]
      );
    }

    // Insert Products (50+ items with authentic Burmese names)
    const products = [
      // Tea Category (id: 1)
      { name_mm: 'လက်ဖက်ရည်ပုံမှန်', name_en: 'Regular Tea', category_id: 1, price: 500 },
      { name_mm: 'လက်ဖက်ရည်ချိုဆိမ့်', name_en: 'Sweet Condensed Tea', category_id: 1, price: 600 },
      { name_mm: 'လက်ဖက်ရည်ကျောက်ပါ', name_en: 'Tea with Sugar', category_id: 1, price: 600 },
      { name_mm: 'လက်ဖက်ရည်ပေါ့ကျ', name_en: 'Light Tea', category_id: 1, price: 500 },
      { name_mm: 'လက်ဖက်ရည်ပြင်းထန်', name_en: 'Strong Tea', category_id: 1, price: 500 },
      { name_mm: 'လက်ဖက်ရည်ဆား', name_en: 'Salt Tea', category_id: 1, price: 500 },
      { name_mm: 'နို့လက်ဖက်ရည်', name_en: 'Milk Tea', category_id: 1, price: 800 },
      { name_mm: 'သံပုရာလက်ဖက်ရည်', name_en: 'Lemon Tea', category_id: 1, price: 700 },
      { name_mm: 'ရေခဲလက်ဖက်ရည်', name_en: 'Iced Tea', category_id: 1, price: 1000 },
      { name_mm: 'ပျားရည်လက်ဖက်ရည်', name_en: 'Honey Tea', category_id: 1, price: 1200 },

      // Coffee & Drinks Category (id: 2)
      { name_mm: 'ကော်ဖီမဲ', name_en: 'Black Coffee', category_id: 2, price: 800 },
      { name_mm: 'ကော်ဖီနို့', name_en: 'Milk Coffee', category_id: 2, price: 1000 },
      { name_mm: 'ရေခဲကော်ဖီ', name_en: 'Iced Coffee', category_id: 2, price: 1200 },
      { name_mm: 'ကော်ဖီမစ်', name_en: 'Coffee Mix', category_id: 2, price: 1000 },
      { name_mm: 'ရေနွေးကြမ်း', name_en: 'Hot Water', category_id: 2, price: 200 },
      { name_mm: 'ရေသန့်', name_en: 'Pure Water', category_id: 2, price: 300 },
      { name_mm: 'သံပုရာရည်', name_en: 'Lemon Juice', category_id: 2, price: 800 },
      { name_mm: 'သံပုရာချဉ်', name_en: 'Lime Soda', category_id: 2, price: 1000 },
      { name_mm: 'သကြားရည်', name_en: 'Sugar Cane Juice', category_id: 2, price: 1200 },
      { name_mm: 'နှမ်းရည်', name_en: 'Sugarcane Lime', category_id: 2, price: 1200 },
      { name_mm: 'ပန်းပွင့်ဖျော်ရည်', name_en: 'Roselle Drink', category_id: 2, price: 800 },
      { name_mm: 'မီလိုဖျော်ရည်', name_en: 'Milo', category_id: 2, price: 1000 },
      { name_mm: 'ရှော့ဘာ', name_en: 'Sherbet', category_id: 2, price: 800 },

      // Snacks Category (id: 3)
      { name_mm: 'စမူဆာကြက်သား', name_en: 'Chicken Samosa', category_id: 3, price: 1000 },
      { name_mm: 'စမူဆာအာလူး', name_en: 'Potato Samosa', category_id: 3, price: 800 },
      { name_mm: 'အီကြာကွေး', name_en: 'Spring Roll', category_id: 3, price: 1200 },
      { name_mm: 'ပေါက်စီကြော်', name_en: 'Fried Bun', category_id: 3, price: 500 },
      { name_mm: 'ပေါက်စီဆူပ်', name_en: 'Steamed Bun', category_id: 3, price: 500 },
      { name_mm: 'ဘဲဥကြော်', name_en: 'Fried Egg', category_id: 3, price: 600 },
      { name_mm: 'ဘဲဥပြုတ်', name_en: 'Boiled Egg', category_id: 3, price: 500 },
      { name_mm: 'ပလာတာ', name_en: 'Palata', category_id: 3, price: 800 },
      { name_mm: 'ပလာတာဒယ်ရီ', name_en: 'Palata with Dairy', category_id: 3, price: 1000 },
      { name_mm: 'နံပြား', name_en: 'Naan Bread', category_id: 3, price: 1000 },
      { name_mm: 'မုန့်ပြား', name_en: 'Biscuit', category_id: 3, price: 300 },
      { name_mm: 'ကြာဇံပေါင်းမုန့်', name_en: 'Fried Sesame Ball', category_id: 3, price: 500 },
      { name_mm: 'နေကြော်', name_en: 'Sun-dried Crackers', category_id: 3, price: 1000 },

      // Noodles & Main Category (id: 4)
      { name_mm: 'မုန့်ဟင်းခါး', name_en: 'Mohinga', category_id: 4, price: 1500 },
      { name_mm: 'မုန့်ဟင်းခါးအထူး', name_en: 'Special Mohinga', category_id: 4, price: 2000 },
      { name_mm: 'နန်းကြီးသုပ်', name_en: 'Nan Gyi Thoke', category_id: 4, price: 1500 },
      { name_mm: 'ရှမ်းခေါက်ဆွဲ', name_en: 'Shan Noodle', category_id: 4, price: 1500 },
      { name_mm: 'ရှမ်းခေါက်ဆွဲခြောက်', name_en: 'Dry Shan Noodle', category_id: 4, price: 1500 },
      { name_mm: 'အုန်းနို့ခေါက်ဆွဲ', name_en: 'Coconut Noodle', category_id: 4, price: 1800 },
      { name_mm: 'ခေါက်ဆွဲသုပ်', name_en: 'Noodle Salad', category_id: 4, price: 1500 },
      { name_mm: 'မုန့်လက်ပာတင်', name_en: 'Mont Let Saung', category_id: 4, price: 1200 },
      { name_mm: 'ကောက်ညှင်းပေါင်း', name_en: 'Corn Cake', category_id: 4, price: 1000 },
      { name_mm: 'မုန့်ဟင်းခါးအမဲသား', name_en: 'Beef Mohinga', category_id: 4, price: 2000 },
      { name_mm: 'ခေါက်ဆွဲကြော်', name_en: 'Fried Noodle', category_id: 4, price: 1800 },
      { name_mm: 'ထမင်းပေါင်း', name_en: 'Fried Rice', category_id: 4, price: 2000 },

      // Dessert Category (id: 5)
      { name_mm: 'ရွှေရင်အေး', name_en: 'Shwe Yin Aye', category_id: 5, price: 1500 },
      { name_mm: 'ဖာလူဒါ', name_en: 'Falooda', category_id: 5, price: 1500 },
      { name_mm: 'မုန့်ချင်းအေး', name_en: 'Mochi Ice Cream', category_id: 5, price: 1200 },
      { name_mm: 'ထန်းလျက်', name_en: 'Jaggery Dessert', category_id: 5, price: 800 },
      { name_mm: 'ကျော့ဖွဲ', name_en: 'Kyauk Kyaw', category_id: 5, price: 1000 },
      { name_mm: 'မုန့်လက်ပာတင်အချိုရည်', name_en: 'Sweet Mont Let Saung', category_id: 5, price: 1200 },
      { name_mm: 'ဆန်းမုန့်', name_en: 'Sanwin Makin', category_id: 5, price: 1000 },
      { name_mm: 'အမဲသီးမုန့်', name_en: 'Strawberry Cake', category_id: 5, price: 1500 }
    ];

    for (const product of products) {
      await client.query(
        'INSERT INTO products (name_mm, name_en, category_id, price) VALUES ($1, $2, $3, $4)',
        [product.name_mm, product.name_en, product.category_id, product.price]
      );
    }

    // Insert Tables (10 tables)
    for (let i = 1; i <= 10; i++) {
      await client.query(
        'INSERT INTO tables (table_number, status) VALUES ($1, $2)',
        [i, 'FREE']
      );
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully with 50+ Burmese menu items!');
    console.log('Categories: 5');
    console.log('Products: ' + products.length);
    console.log('Tables: 10');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

// Run the seeder
const initDatabase = async () => {
  try {
    console.log('Creating tables...');
    await createTables();
    console.log('Seeding data...');
    await seedData();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
