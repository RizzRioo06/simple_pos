import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterfaceSelector from './components/InterfaceSelector';
import CustomerTableSelector from './components/CustomerTableSelector';
import CustomerInterface from './components/CustomerInterface';
import WaiterInterface from './components/WaiterInterface';
import CashierInterface from './components/CashierInterface';
import TableDashboard from './components/TableDashboard';
import OrderInterface from './components/OrderInterface';
import Checkout from './components/Checkout';
import Kitchen from './components/Kitchen';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterfaceSelector />} />
        <Route path="/customer-select" element={<CustomerTableSelector />} />
        <Route path="/customer/:tableId" element={<CustomerInterface />} />
        <Route path="/waiter" element={<WaiterInterface />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/cashier" element={<CashierInterface />} />
        <Route path="/tables" element={<TableDashboard />} />
        <Route path="/order/:tableId" element={<OrderInterface />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
