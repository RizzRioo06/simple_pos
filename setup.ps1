# POS System Setup and Test Script

Write-Host "=== Burmese Tea Shop POS System Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend/server.js")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Setting up database schema and seeding data..." -ForegroundColor Yellow
Set-Location backend
node seed.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database setup failed! Please check your database connection." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Database schema created and data seeded successfully!" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "Step 2: Checking dependencies..." -ForegroundColor Yellow

# Check backend dependencies
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check frontend dependencies
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
} else {
    Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    # Check if react-scripts is properly installed
    $reactScripts = Get-ChildItem -Path "node_modules/.bin" -Filter "react-scripts*" -ErrorAction SilentlyContinue
    if (-not $reactScripts) {
        Write-Host "React-scripts missing, reinstalling..." -ForegroundColor Yellow
        npm install
    }
    Set-Location ..
}

Write-Host "✓ Dependencies checked!" -ForegroundColor Green
Write-Host ""

Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the system:" -ForegroundColor Cyan
Write-Host "1. Open a terminal and run: cd backend && npm start" -ForegroundColor White
Write-Host "2. Open another terminal and run: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "3. Access the system at: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Quick Test Guide:" -ForegroundColor Cyan
Write-Host "• Select 'Customer' interface to order food" -ForegroundColor White
Write-Host "• Select 'Kitchen' interface to cook orders" -ForegroundColor White
Write-Host "• Select 'Waiter' interface to serve food" -ForegroundColor White
Write-Host "• Select 'Cashier' interface to process payments" -ForegroundColor White
Write-Host ""
Write-Host "For detailed workflow, see WORKFLOW_GUIDE.md" -ForegroundColor Yellow
