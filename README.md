# Burmese Tea Shop POS System
## လက်ဖက်ရည်ဆိုင် POS စနစ်

A complete Point of Sale web application for Burmese Tea Shops with waiter-assisted ordering, mobile-first design, and "Eat First, Pay Later" workflow.

## 🌟 Features

- **Table Management Dashboard**: Visual grid of all tables with real-time status (Free/Occupied)
- **Mobile-First Design**: Optimized for waiter use on mobile phones
- **Session-Based Ordering**: "Eat First, Pay Later" workflow
- **Burmese Unicode Support**: Full support for Myanmar script (50+ authentic menu items)
- **Search Functionality**: Search menu items in Burmese or English
- **Kitchen View**: Real-time order tracking for kitchen staff
- **Digital Receipt**: QR code payment integration (KPay/WavePay)
- **Order Management**: Add items, track orders, and close tables seamlessly

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- RESTful API architecture
- CORS enabled for cross-origin requests

### Frontend
- **React.js** (v18.2.0)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- Mobile-responsive design

## 📁 Project Structure

```
POS SImple Project/
├── backend/
│   ├── config/
│   │   ├── database.js       # PostgreSQL connection
│   │   └── schema.js          # Database schema creation
│   ├── routes/
│   │   ├── tables.js          # Table management endpoints
│   │   ├── categories.js      # Category endpoints
│   │   ├── products.js        # Product and search endpoints
│   │   └── orders.js          # Order management endpoints
│   ├── server.js              # Express server setup
│   ├── seed.js                # Database seeder (50+ items)
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TableDashboard.js   # Main table view
    │   │   ├── OrderInterface.js   # Order taking screen
    │   │   ├── Checkout.js         # Checkout & payment
    │   │   └── Kitchen.js          # Kitchen view
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## 🗄️ Database Schema

### Tables

1. **categories**
   - `id` (Serial, Primary Key)
   - `name_mm` (Burmese name)
   - `name_en` (English name)
   - `created_at`

2. **products**
   - `id` (Serial, Primary Key)
   - `name_mm` (Burmese name)
   - `name_en` (English name)
   - `category_id` (Foreign Key)
   - `price` (Decimal)
   - `available` (Boolean)
   - `created_at`

3. **tables**
   - `id` (Serial, Primary Key)
   - `table_number` (Unique)
   - `status` ('FREE' or 'OCCUPIED')
   - `created_at`

4. **orders**
   - `id` (Serial, Primary Key)
   - `table_id` (Foreign Key)
   - `status` ('OPEN' or 'COMPLETED')
   - `total_amount` (Decimal)
   - `created_at`
   - `completed_at`

5. **order_items**
   - `id` (Serial, Primary Key)
   - `order_id` (Foreign Key)
   - `product_id` (Foreign Key)
   - `quantity` (Integer)
   - `price` (Decimal)
   - `status` ('PENDING' or 'SERVED')
   - `created_at`
   - `served_at`

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```powershell
cd "d:\POS SImple Project\backend"
```

2. Install dependencies:
```powershell
npm install
```

3. Create PostgreSQL database:
```sql
CREATE DATABASE burmese_teashop_pos;
```

4. Configure environment variables:
```powershell
Copy-Item .env.example .env
```

Edit `.env` file with your database credentials:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=burmese_teashop_pos
DB_USER=postgres
DB_PASSWORD=your_password_here
```

5. Run database seeder (creates tables and inserts 50+ menu items):
```powershell
npm run seed
```

6. Start the backend server:
```powershell
npm run dev
```

Server will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```powershell
cd "d:\POS SImple Project\frontend"
```

2. Install dependencies:
```powershell
npm install
Testing
```

3. Start the development server:
```powershell
npm start 

```

Application will open at `http://localhost:3000`

## 🔌 API Endpoints

### Tables
- `GET /api/tables` - Get all tables with current bill info
- `GET /api/tables/:id` - Get single table details
- `PATCH /api/tables/:id/status` - Update table status

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/with-products` - Get categories with products

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?q={query}` - Search products (Burmese/English)
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders/start` - Create new order or get existing
- `GET /api/orders/:id` - Get order details with items
- `POST /api/orders/:id/items` - Add items to order
- `GET /api/orders/:id/checkout` - Get checkout summary
- `POST /api/orders/:id/complete` - Complete order and close table
- `GET /api/orders/kitchen/pending` - Get kitchen pending items
- `PATCH /api/orders/items/:itemId/serve` - Mark item as served

## 🎯 Workflow

1. **Table Selection**: Waiter views table dashboard
   - Green tables = Free
   - Red tables = Occupied (shows current bill)

2. **Order Taking**:
   - Click a FREE table → Creates new session (Status: OPEN)
   - Click an OCCUPIED table → Adds to existing order
   - Search menu items in Burmese or English
   - Add items to cart
   - Click "Send to Kitchen" → Items appear in Kitchen View

3. **Kitchen View**:
   - See all pending orders
   - Mark items as "Done" when prepared

4. **Checkout**:
   - Click "Checkout" on active table
   - View digital receipt
   - Show QR code for payment
   - Click "Close Table" after payment verification
   - Table returns to FREE status

## 📱 Menu Categories (50+ Items)

1. **လက်ဖက်ရည် (Tea)** - 10 items
   - Regular tea, Sweet tea, Milk tea, Lemon tea, etc.

2. **အအေးနှင့်ကော်ဖီ (Coffee & Drinks)** - 13 items
   - Black coffee, Milk coffee, Lemon juice, Milo, etc.

3. **အဆာပြေ (Snacks)** - 13 items
   - Samosas, Spring rolls, Palata, Eggs, etc.

4. **မနက်စာ (Noodles & Main)** - 12 items
   - Mohinga, Shan noodles, Coconut noodles, etc.

5. **အချိုပွဲ (Dessert)** - 8 items
   - Shwe Yin Aye, Falooda, Various Burmese desserts

## 🎨 UI Features

- **Responsive Design**: Works on phones, tablets, and desktops
- **Burmese Font Support**: Proper rendering of Myanmar Unicode
- **Real-time Updates**: Auto-refresh for tables and kitchen views
- **Touch-Friendly**: Large buttons optimized for mobile use
- **Color-Coded Status**: Visual indicators for table availability

## 🔧 Customization

### Adding QR Code Payment
Replace the placeholder in `Checkout.js` with your actual QR code image:
```javascript
// Add image to frontend/public/images/shop-qr.png
<img src="/images/shop-qr.png" alt="Payment QR Code" />
```

### Adding More Tables
Edit the seeder in `backend/seed.js`:
```javascript
for (let i = 1; i <= 20; i++) {  // Change 10 to 20 for 20 tables
  await client.query(
    'INSERT INTO tables (table_number, status) VALUES ($1, $2)',
    [i, 'FREE']
  );
}
```

### Adding More Menu Items
Edit the `products` array in `backend/seed.js` with Burmese Unicode names.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists

### Port Already in Use
```powershell
# Change port in backend/.env
PORT=5001

# Change port in frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
```

### Burmese Text Not Displaying
- Ensure Myanmar Unicode fonts are installed
- Use Unicode input (not Zawgyi)

## 📝 License

MIT License - Feel free to use for your tea shop!

## 🙏 Acknowledgments

- Designed for Myanmar tea shop operations
- Unicode Burmese language support
- Mobile-first approach for real-world waiter usage

---

**Developer Notes**: This system uses session-based ordering where each table can have one open order at a time. Payment is verified manually by the waiter after QR code scanning. The system prioritizes simplicity and mobile usability over complex features.
