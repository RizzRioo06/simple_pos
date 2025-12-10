import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableDashboard from './components/TableDashboard';
import OrderInterface from './components/OrderInterface';
import Checkout from './components/Checkout';
import Kitchen from './components/Kitchen';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableDashboard />} />
        <Route path="/order/:tableId" element={<OrderInterface />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </Router>
  );
}

export default App;
