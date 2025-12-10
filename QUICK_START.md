# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## 1️⃣ Environment Setup

Create `.env` file in `backend` folder:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
PORT=5000
```

## 2️⃣ Automated Setup

Run the setup script:
```powershell
.\setup.ps1
```

This will:
- ✅ Create database tables
- ✅ Seed sample data (50+ menu items, 10 tables)
- ✅ Install dependencies

## 3️⃣ Start the Application

### Terminal 1 - Backend:
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
Frontend opens at: `http://localhost:3000`

## 4️⃣ Test the System

### Quick 5-Minute Test:

1. **Home Page** (`http://localhost:3000`)
   - See 4 interface options

2. **Customer Interface**
   - Click "Customer"
   - Select "Table 1"
   - Add "လက်ဖက်ရည်ပုံမှန်" (Regular Tea) to cart
   - Add "မုန့်ဟင်းခါး" (Mohinga)
   - Click "Submit Order"

3. **Kitchen Interface** (Open new tab)
   - Click "Kitchen" from home
   - See your order appear
   - Click "Receive" → "Start Cook" → "Done"

4. **Waiter Interface** (Open new tab)
   - Click "Waiter" from home
   - See items ready to serve
   - Click "✓ Serve" for each item

5. **Customer Payment** (Go back to customer tab)
   - See "Pay Now" button
   - Click "Pay Now"
   - Select "Cash"
   - Click "Submit Payment"

6. **Cashier Interface** (Open new tab)
   - Click "Cashier" from home
   - See the order
   - Click "View Details"
   - Click "✓ Verify Payment & Complete"

7. **Customer Confirmation** (Go back to customer tab)
   - See payment success message! ✅

8. **Waiter Cleanup** (Go back to waiter tab)
   - See Table 1 in "Tables to Clean"
   - Click "Mark Clean"
   - Table is now FREE! 🎉

## 🎯 Interface URLs

| Interface | URL | Purpose |
|-----------|-----|---------|
| Home | `http://localhost:3000/` | Interface selector |
| Customer | `http://localhost:3000/customer/:tableId` | Browse & order |
| Kitchen | `http://localhost:3000/kitchen` | Cook orders |
| Waiter | `http://localhost:3000/waiter` | Serve & clean |
| Cashier | `http://localhost:3000/cashier` | Process payments |
| Admin | `http://localhost:3000/tables` | Table management |

## 📱 Testing Tips

### Multi-Tab Testing:
1. Open 4 browser tabs
2. Tab 1: Customer interface
3. Tab 2: Kitchen interface
4. Tab 3: Waiter interface
5. Tab 4: Cashier interface
6. Watch real-time updates across all tabs!

### Status Monitoring:
- All interfaces auto-refresh every 3 seconds
- Watch status badges change colors
- Track timestamps in kitchen interface

### Payment Testing:
- **Cash**: Just select and submit
- **Bank Transfer**: Paste any text as "slip"
- Cashier can review both types

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check database connection
cd backend
node -e "require('./config/database').query('SELECT NOW()', (err, res) => { console.log(err || res.rows); process.exit(); })"
```

### Frontend errors?
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Database issues?
```bash
# Re-run seeder
cd backend
node seed.js
```

### Port already in use?
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

## 📚 Documentation

- **Detailed Workflow**: See `WORKFLOW_GUIDE.md`
- **Architecture**: See `SYSTEM_ARCHITECTURE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See `API_DOCUMENTATION.md`

## 🎓 Learning Path

1. **Day 1**: Setup & explore interfaces
2. **Day 2**: Test complete workflow
3. **Day 3**: Review code structure
4. **Day 4**: Customize UI/UX
5. **Day 5**: Add new features

## ⚡ Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify `.env` credentials
- Test connection string

### "Port 5000 already in use"
- Another app is using port 5000
- Change PORT in backend `.env`
- Or kill the process using the port

### "Network Error" in frontend
- Backend not running
- Check backend URL in `api.js`
- Verify CORS settings

### Orders not appearing
- Check browser console for errors
- Verify database has data (`SELECT * FROM orders;`)
- Check backend logs for API errors

## 🎉 Success Indicators

You'll know it's working when:
- ✅ 4 interfaces accessible from home page
- ✅ Customer can browse menu and order
- ✅ Kitchen receives orders in real-time
- ✅ Waiter sees ready-to-serve items
- ✅ Cashier can verify payments
- ✅ Status updates across all interfaces
- ✅ Complete order flow works end-to-end

## 🚀 Next Steps

Once basic testing works:
1. Try different payment methods
2. Test with multiple tables
3. Order multiple items at once
4. Track cooking time in kitchen
5. Monitor table status changes

## 💡 Pro Tips

- **Keep all tabs open** during testing for real-time sync
- **Use browser DevTools** to see API calls
- **Check backend terminal** for request logs
- **Watch database** with pgAdmin for data changes
- **Test edge cases** like cancelled orders or table conflicts

## 📞 Need Help?

1. Check documentation files
2. Review browser console errors
3. Check backend logs
4. Verify database data
5. Test API endpoints with Postman

---

**Ready? Let's go!** 🎯

Run `.\setup.ps1` and start testing! 🚀
