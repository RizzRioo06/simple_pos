import React, { useState, useEffect } from 'react';
import api from '../services/api';

function WaiterInterface() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, tablesRes] = await Promise.all([
        api.get('/orders/waiter/ready-to-serve'),
        api.get('/tables')
      ]);
      
      setReadyOrders(ordersRes.data);
      setTables(tablesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const serveItem = async (itemId) => {
    try {
      await api.patch(`/orders/items/${itemId}/serve`);
      loadData();
    } catch (error) {
      console.error('Error serving item:', error);
      alert('Failed to mark item as served');
    }
  };

  const cleanTable = async (tableId) => {
    if (!window.confirm('Mark this table as clean and free?')) return;
    
    try {
      await api.post(`/orders/tables/${tableId}/clean`);
      loadData();
    } catch (error) {
      console.error('Error cleaning table:', error);
      alert('Failed to clean table');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { icon: '🔔', text: 'New', color: 'bg-yellow-500', animation: 'animate-pulse' },
      RECEIVED: { icon: '👨‍🍳', text: 'Preparing', color: 'bg-blue-500', animation: 'animate-bounce' },
      COOKING: { icon: '🔥', text: 'Cooking', color: 'bg-orange-500', animation: 'animate-pulse' },
      DONE: { icon: '✅', text: 'Ready', color: 'bg-green-500', animation: 'animate-bounce' }
    };
    return badges[status] || badges.PENDING;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const paidTables = tables.filter(t => t.status === 'OCCUPIED' && !t.order_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Waiter Dashboard</h1>
        <p className="text-center text-green-100 mt-2">Serve food & manage tables</p>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Ready to Serve Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              🍽️ Ready to Serve ({readyOrders.length})
            </h2>
          </div>

          {readyOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No orders ready to serve
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readyOrders.map(order => (
                <div key={order.order_id} className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      Table {order.table_number}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Ready
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex-1">
                          <p className="font-semibold">{item.product_name_mm}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.status !== 'DONE' && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`${getStatusBadge(item.status).color} ${getStatusBadge(item.status).animation} text-white text-xs px-2 py-1 rounded-full`}>
                                {getStatusBadge(item.status).icon} {getStatusBadge(item.status).text}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => serveItem(item.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          ✓ Serve
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tables to Clean */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🧹 Tables to Clean</h2>
            {paidTables.length > 0 && (
              <span className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                {paidTables.length} waiting
              </span>
            )}
          </div>

          {paidTables.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No tables need cleaning
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {paidTables.map(table => (
                <div
                  key={table.id}
                  className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">🧹</div>
                  <p className="font-bold text-lg">Table {table.table_number}</p>
                  <p className="text-sm text-gray-600 mb-3">Payment done</p>
                  <button
                    onClick={() => cleanTable(table.id)}
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                  >
                    Mark Clean
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Tables Overview */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📋 All Tables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                className={`rounded-lg p-4 text-center shadow ${
                  table.status === 'FREE'
                    ? 'bg-gray-100 border-2 border-gray-300'
                    : 'bg-blue-50 border-2 border-blue-400'
                }`}
              >
                <div className="text-3xl mb-2">
                  {table.status === 'FREE' ? '⚪' : '🔵'}
                </div>
                <p className="font-bold text-lg">Table {table.table_number}</p>
                <p className={`text-sm font-semibold ${
                  table.status === 'FREE' ? 'text-gray-600' : 'text-blue-600'
                }`}>
                  {table.status}
                </p>
                {table.current_bill > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {table.current_bill.toLocaleString()} MMK
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterInterface;
