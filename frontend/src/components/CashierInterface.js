import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CashierInterface() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/cashier/pending-payment');
      setPendingOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const verifyPayment = async (orderId) => {
    if (!window.confirm('Verify this payment as completed?')) return;

    try {
      await api.post(`/orders/${orderId}/verify-payment`);
      setSelectedOrder(null);
      loadOrders();
      alert('Payment verified successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { icon: '🔔', text: 'New', color: 'bg-yellow-500', animation: 'animate-pulse' },
      RECEIVED: { icon: '👨‍🍳', text: 'Preparing', color: 'bg-blue-500', animation: 'animate-bounce' },
      COOKING: { icon: '🔥', text: 'Cooking', color: 'bg-orange-500', animation: 'animate-pulse' },
      DONE: { icon: '✅', text: 'Ready', color: 'bg-green-500', animation: 'animate-bounce' },
      SERVED: { icon: '🍽️', text: 'Served', color: 'bg-purple-500', animation: '' },
      PAID: { icon: '💰', text: 'Paid', color: 'bg-indigo-600', animation: 'animate-pulse' }
    };
    return badges[status] || badges.PENDING;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
          <button
            onClick={() => setSelectedOrder(null)}
            className="mb-4 bg-white/20 px-4 py-2 rounded hover:bg-white/30"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-center">Order Details</h1>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-2xl font-bold text-purple-600">#{selectedOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Table</p>
                <p className="text-2xl font-bold">{selectedOrder.table_number}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-lg mb-3">Order Items:</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div className="flex-1">
                    <p className="font-semibold">{item.product_name_mm}</p>
                    <p className="text-sm text-gray-500">{item.product_name_en}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`${getStatusBadge(item.status).color} ${getStatusBadge(item.status).animation} text-white text-xs px-3 py-1 rounded-full whitespace-nowrap`}>
                      {getStatusBadge(item.status).icon} {getStatusBadge(item.status).text}
                    </span>
                    <div className="text-right">
                      <p className="font-semibold">x{item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        {(item.price * item.quantity).toLocaleString()} MMK
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Amount:</span>
                <span className="text-3xl font-bold text-purple-600">
                  {selectedOrder.total_amount.toLocaleString()} MMK
                </span>
              </div>
            </div>

            {selectedOrder.payment_method && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-blue-900 mb-2">Payment Method:</p>
                <p className="text-blue-700">
                  {selectedOrder.payment_method === 'CASH' ? '💵 Cash' : '🏦 Bank Transfer'}
                </p>
              </div>
            )}

            {selectedOrder.payment_slip && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-yellow-900 mb-2">Payment Slip Submitted:</p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-700 break-all">
                    {selectedOrder.payment_slip}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => verifyPayment(selectedOrder.id)}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700"
            >
              ✓ Verify Payment & Complete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Cashier Dashboard</h1>
        <p className="text-center text-purple-100 mt-2">Verify payments & complete orders</p>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            💳 Pending Payments ({pendingOrders.length})
          </h2>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <div className="text-6xl mb-4">💤</div>
            <p className="text-xl">No pending payments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => viewOrderDetails(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      Table {order.table_number}
                    </p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {order.status}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {order.total_amount.toLocaleString()} MMK
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    {order.items.length} item(s):
                  </p>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <span className="text-gray-600">{item.product_name_mm}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className={`${getStatusBadge(item.status).color} ${getStatusBadge(item.status).animation} text-white text-xs px-2 py-1 rounded-full ml-2`}>
                        {getStatusBadge(item.status).icon}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{order.items.length - 3} more...
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    viewOrderDetails(order);
                  }}
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CashierInterface;
