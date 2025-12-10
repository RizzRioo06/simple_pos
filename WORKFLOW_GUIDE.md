# Complete POS System Workflow Guide

## System Overview

This POS system now includes 4 distinct interfaces for a complete restaurant workflow:

1. **Customer Interface** - Browse menu, order food, and pay
2. **Kitchen Interface** - Receive orders, cook, and mark as done
3. **Waiter Interface** - Serve food and clean tables
4. **Cashier Interface** - Verify payments and complete transactions

## Setup Instructions

### 1. Database Setup

Run the schema update to add new fields:

```bash
cd backend
node -e "require('./config/schema').createTables()"
```

### 2. Start the Backend

```bash
cd backend
npm start
```

Backend runs on `http://localhost:5000`

### 3. Start the Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`

## Complete Workflow Test

### Step 1: Customer Orders (Customer Interface)

1. Go to `http://localhost:3000`
2. Click on **"Customer"** interface
3. Select a table (e.g., Table 1)
4. Browse the menu by category
5. Add items to cart
6. Adjust quantities if needed
7. Click **"Submit Order"**
8. Order status changes to **PENDING**

### Step 2: Kitchen Receives & Cooks (Kitchen Interface)

1. Open a new tab: `http://localhost:3000`
2. Click on **"Kitchen"** interface
3. See the new order appear with status **"New"**
4. Click **"Receive"** button (status → RECEIVED)
5. Click **"Start Cook"** button (status → COOKING)
6. Click **"Done"** button (status → DONE)
7. Food is now ready for waiter to serve

### Step 3: Waiter Serves Food (Waiter Interface)

1. Open a new tab: `http://localhost:3000`
2. Click on **"Waiter"** interface
3. See the order in **"Ready to Serve"** section
4. Click **"✓ Serve"** button for each item
5. Order status changes to **SERVED**
6. Customer can now pay

### Step 4: Customer Pays (Customer Interface)

1. Go back to customer tab
2. Notice **"Pay Now"** button appears
3. Click **"Pay Now"**
4. Select payment method:
   - **Cash**: Just click Submit Payment
   - **Bank Transfer**: Paste any text as "payment slip" (for testing)
5. Click **"Submit Payment"**
6. Wait for cashier verification

### Step 5: Cashier Verifies Payment (Cashier Interface)

1. Open a new tab: `http://localhost:3000`
2. Click on **"Cashier"** interface
3. See the order in **"Pending Payments"**
4. Click **"View Details"** to see order summary
5. Verify the amount and items
6. If payment slip was submitted, review it
7. Click **"✓ Verify Payment & Complete"**
8. Order status changes to **PAID**

### Step 6: Customer Sees Confirmation

1. Go back to customer tab
2. See success message with payment confirmation
3. Customer experience is complete

### Step 7: Waiter Cleans Table (Waiter Interface)

1. Go back to waiter tab
2. See the table in **"Tables to Clean"** section
3. Click **"Mark Clean"**
4. Table status changes to **FREE**
5. Table is ready for next customer

## Order Status Flow

```
PENDING (Customer ordered)
   ↓
RECEIVED (Kitchen acknowledged)
   ↓
COOKING (Kitchen is cooking)
   ↓
DONE (Food ready)
   ↓
SERVED (Waiter served to customer)
   ↓
PAID (Cashier verified payment)
   ↓
Table cleaned (Waiter)
   ↓
Table FREE (Ready for next customer)
```

## Interface Features

### Customer Interface
- ✅ Browse menu by category
- ✅ Add items to cart with quantities
- ✅ Submit orders
- ✅ Real-time order status updates
- ✅ Payment submission (Cash/Bank Transfer)
- ✅ Payment slip upload (for testing)
- ✅ Payment confirmation display

### Kitchen Interface
- ✅ View all incoming orders
- ✅ Receive orders (acknowledge)
- ✅ Start cooking (track progress)
- ✅ Mark as done
- ✅ Status indicators (Pending/Received/Cooking/Done)
- ✅ Timestamps for each stage
- ✅ Auto-refresh (3 seconds)

### Waiter Interface
- ✅ View orders ready to serve
- ✅ Mark items as served
- ✅ View tables needing cleaning
- ✅ Clean tables (mark as FREE)
- ✅ All tables overview
- ✅ Real-time updates

### Cashier Interface
- ✅ View all served orders awaiting payment
- ✅ View order details and items
- ✅ Verify total amounts
- ✅ Check payment method
- ✅ Review payment slips
- ✅ Verify and complete payments
- ✅ Professional receipt-style display

## Testing Notes

### Payment Testing
- This system uses **simulated payments** (no real payment gateway)
- For **Cash**: Just select and submit
- For **Bank Transfer**: Paste any text as a "slip" for testing
- Cashier can review and verify any submission

### QR Code Functionality
- Tables can have QR codes (stored in database)
- In production: Customer scans QR → Direct to menu
- For testing: Use table selector interface

### Multi-User Testing
- Open multiple browser tabs/windows
- Each tab represents a different user role
- All interfaces update in real-time
- Test the complete flow from order to payment

## API Endpoints

### Orders
- `POST /api/orders/start` - Create/get order for table
- `POST /api/orders/:id/items` - Add items to order
- `GET /api/orders/kitchen/pending` - Get kitchen orders
- `GET /api/orders/waiter/ready-to-serve` - Get orders ready to serve
- `GET /api/orders/cashier/pending-payment` - Get orders awaiting payment

### Order Items
- `PATCH /api/orders/items/:itemId/receive` - Kitchen receives order
- `PATCH /api/orders/items/:itemId/start-cooking` - Start cooking
- `PATCH /api/orders/items/:itemId/done-cooking` - Mark as cooked
- `PATCH /api/orders/items/:itemId/serve` - Waiter serves item

### Payment
- `POST /api/orders/:id/submit-payment` - Customer submits payment
- `POST /api/orders/:id/verify-payment` - Cashier verifies payment

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables/:id/generate-qr` - Generate QR code
- `POST /api/orders/tables/:tableId/clean` - Clean table

## Database Schema Updates

### Tables
- Added `qr_code` field for QR code URLs

### Orders
- Changed default status from `OPEN` to `PENDING`
- Added `payment_method` (CASH/BANK_TRANSFER)
- Added `payment_slip` (text/URL)
- Added `payment_verified` (boolean)

### Order Items
- Added `received_at` timestamp
- Added `cooking_started_at` timestamp
- Added `cooked_at` timestamp
- Kept `served_at` timestamp

## Future Enhancements

- Real payment gateway integration
- QR code generation library
- Push notifications for each role
- Order modification/cancellation
- Kitchen printer integration
- Analytics dashboard
- Multiple language support (full)
- Table reservation system

## Troubleshooting

### Orders not appearing?
- Check backend is running on port 5000
- Check browser console for errors
- Verify database connection

### Status not updating?
- Interfaces auto-refresh every 3 seconds
- Manually refresh if needed
- Check network requests in browser DevTools

### Payment not working?
- Ensure order status is SERVED
- Check cashier interface for the order
- Verify payment was submitted by customer

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console errors
- Network requests in DevTools
- Database connection status
