# Database Setup Guide
## PostgreSQL Installation and Configuration

## Step 1: Install PostgreSQL

### Option A: Download and Install PostgreSQL
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (recommended version: 14 or higher)
3. During installation:
   - Set a **password** for the postgres user (remember this!)
   - Keep the default port: **5432**
   - Install pgAdmin 4 (database management tool)

### Option B: Use Docker (Alternative)
```powershell
docker run --name postgres-teashop -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

---

## Step 2: Create the Database

### Method 1: Using pgAdmin (GUI - Easiest)

1. **Open pgAdmin 4** (installed with PostgreSQL)
2. Connect to PostgreSQL:
   - Right-click "Servers" → "Create" → "Server"
   - Name: `Local PostgreSQL`
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (the password you set during installation)
3. **Create Database**:
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `burmese_teashop_pos`
   - Click "Save"

**✅ Done! Skip to Step 3.**

---

### Method 2: Using psql Command Line

1. **Open PowerShell as Administrator**

2. **Find psql location** (usually installed at):
   ```
   C:\Program Files\PostgreSQL\16\bin\psql.exe
   ```

3. **Connect to PostgreSQL**:
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
   ```
   
4. **Enter your password** when prompted

5. **Create the database**:
   ```sql
   CREATE DATABASE burmese_teashop_pos;
   ```

6. **Verify it was created**:
   ```sql
   \l
   ```
   (You should see `burmese_teashop_pos` in the list)

7. **Exit psql**:
   ```sql
   \q
   ```

---

### Method 3: Using Windows SQL Shell (SQL Shell - psql)

1. Search for "**SQL Shell (psql)**" in Windows Start Menu
2. Press Enter 4 times to accept defaults:
   - Server [localhost]:
   - Database [postgres]:
   - Port [5432]:
   - Username [postgres]:
3. Enter your PostgreSQL password
4. Run this command:
   ```sql
   CREATE DATABASE burmese_teashop_pos;
   ```
5. Type `\q` to exit

---

## Step 3: Configure Backend Environment

1. **Navigate to backend folder**:
   ```powershell
   cd "d:\POS SImple Project\backend"
   ```

2. **Create .env file** (copy from example):
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit .env file** with your settings:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=burmese_teashop_pos
   DB_USER=postgres
   DB_PASSWORD=YOUR_PASSWORD_HERE
   ```
   
   **⚠️ Important**: Replace `YOUR_PASSWORD_HERE` with your actual PostgreSQL password!

---

## Step 4: Install Backend Dependencies

```powershell
cd "d:\POS SImple Project\backend"
npm install
```

This installs:
- express (web server)
- pg (PostgreSQL client)
- cors (cross-origin support)
- dotenv (environment variables)
- body-parser (request parsing)

---

## Step 5: Run Database Seeder

This creates all tables and inserts 50+ menu items:

```powershell
npm run seed
```

**Expected output:**
```
Creating tables...
Connected to PostgreSQL database
All tables created successfully
Seeding data...
Database seeded successfully with 50+ Burmese menu items!
Categories: 5
Products: 56
Tables: 10
```

---

## Step 6: Start the Backend Server

```powershell
npm run dev
```

**Expected output:**
```
Server is running on port 5000
API available at http://localhost:5000/api
Connected to PostgreSQL database
```

---

## Step 7: Test the API

Open a new PowerShell window and test:

```powershell
# Test health check
curl http://localhost:5000/api/health

# Test getting tables
curl http://localhost:5000/api/tables

# Test getting products
curl http://localhost:5000/api/products
```

Or open in your browser: http://localhost:5000/api/tables

---

## Step 8: Start the Frontend

**Open a new PowerShell window**:

```powershell
cd "d:\POS SImple Project\frontend"
npm install
npm start
```

The browser will automatically open at: http://localhost:3000

---

## Troubleshooting

### Problem 1: "psql: error: connection to server failed"
**Solution**: PostgreSQL service is not running
- Open "Services" (search in Windows)
- Find "postgresql-x64-16" (or similar)
- Right-click → Start

### Problem 2: "password authentication failed"
**Solution**: Wrong password in .env file
- Edit `backend/.env`
- Update `DB_PASSWORD` with correct password

### Problem 3: "database does not exist"
**Solution**: Database not created yet
- Follow Step 2 again to create the database

### Problem 4: "Port 5432 already in use"
**Solution**: Another process is using the port
- Check if PostgreSQL is already running
- Or change port in .env file

### Problem 5: "Cannot find module 'pg'"
**Solution**: Dependencies not installed
```powershell
cd "d:\POS SImple Project\backend"
npm install
```

### Problem 6: Backend runs but can't connect to database
**Check these**:
1. PostgreSQL is running (check Services)
2. Database `burmese_teashop_pos` exists
3. .env file has correct credentials
4. No firewall blocking port 5432

---

## Verify Database Tables

### Using pgAdmin:
1. Open pgAdmin
2. Navigate to: Servers → Local → Databases → burmese_teashop_pos → Schemas → public → Tables
3. You should see 5 tables:
   - categories
   - products
   - tables
   - orders
   - order_items

### Using psql:
```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d burmese_teashop_pos
```

```sql
-- List all tables
\dt

-- View categories
SELECT * FROM categories;

-- View products count
SELECT COUNT(*) FROM products;

-- View all tables
SELECT * FROM tables;

-- Exit
\q
```

---

## Quick Reference

### Start Backend (in backend folder):
```powershell
npm run dev
```

### Start Frontend (in frontend folder):
```powershell
npm start
```

### Re-seed Database (if you need fresh data):
```powershell
cd backend
npm run seed
```

### Check if PostgreSQL is running:
```powershell
Get-Service postgresql*
```

### Start PostgreSQL service:
```powershell
Start-Service postgresql-x64-16
```

---

## Database Credentials Summary

Save these for your reference:

```
Database Name: burmese_teashop_pos
Host: localhost
Port: 5432
Username: postgres
Password: [your password]
```

---

## Next Steps After Setup

1. ✅ Backend running on http://localhost:5000
2. ✅ Frontend running on http://localhost:3000
3. ✅ Database has 56 menu items in Burmese
4. ✅ 10 tables ready to use
5. 🎉 Start using the POS system!

---

## Need Help?

If you encounter any issues:
1. Check the Terminal for error messages
2. Verify all services are running
3. Double-check .env configuration
4. Make sure PostgreSQL service is started
5. Try restarting both backend and frontend

**Common Success Indicators:**
- ✅ "Connected to PostgreSQL database" in backend terminal
- ✅ "Compiled successfully!" in frontend terminal
- ✅ Can see tables dashboard in browser
