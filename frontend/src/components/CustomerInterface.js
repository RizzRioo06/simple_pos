import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function CustomerInterface() {
  const { tableId } = useParams();
  const [table, setTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(true);
  const [showOrderStatus, setShowOrderStatus] = useState(false);

  useEffect(() => {
    loadInitialData();
    // Poll for order status changes
    const interval = setInterval(checkOrderStatus, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  const loadInitialData = async () => {
    try {
      // Load table info
      const tableRes = await api.get(`/tables/${tableId}`);
      setTable(tableRes.data);

      // Load or create order
      const orderRes = await api.post('/orders/start', { table_id: parseInt(tableId) });
      
      // Fetch full order details with items
      if (orderRes.data.id) {
        const fullOrderRes = await api.get(`/orders/${orderRes.data.id}`);
        setOrder(fullOrderRes.data);
      } else {
        setOrder(orderRes.data);
      }

      // Load categories and products
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data);

      const productsRes = await api.get('/products');
      setProducts(productsRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const checkOrderStatus = async () => {
    if (order) {
      try {
        const res = await api.get(`/orders/${order.id}`);
        setOrder(res.data);
        
        // If order is paid, show success
        if (res.data.status === 'PAID') {
          setShowPayment(false);
        }
      } catch (error) {
        console.error('Error checking order status:', error);
      }
    }
  };

  const getOrderItemStatus = () => {
    if (!order?.items || order.items.length === 0) return null;
    
    const statuses = order.items.map(item => item.status);
    if (statuses.every(s => s === 'SERVED')) return 'SERVED';
    if (statuses.some(s => s === 'DONE')) return 'DONE';
    if (statuses.some(s => s === 'COOKING')) return 'COOKING';
    if (statuses.some(s => s === 'RECEIVED')) return 'RECEIVED';
    return 'PENDING';
  };

  const getStatusDisplay = (status) => {
    const displays = {
      PENDING: { icon: '🔔', text: 'Order Received', color: 'bg-yellow-100 text-yellow-800', animation: 'animate-pulse' },
      RECEIVED: { icon: '👨‍🍳', text: 'Kitchen Confirmed', color: 'bg-blue-100 text-blue-800', animation: 'animate-bounce' },
      COOKING: { icon: '🔥', text: 'Cooking...', color: 'bg-orange-100 text-orange-800', animation: 'animate-pulse' },
      DONE: { icon: '✅', text: 'Ready to Serve', color: 'bg-green-100 text-green-800', animation: 'animate-bounce' },
      SERVED: { icon: '🍽️', text: 'Enjoy Your Meal!', color: 'bg-purple-100 text-purple-800', animation: '' }
    };
    return displays[status] || displays.PENDING;
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product_id: product.id, quantity: 1, ...product }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;

    try {
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await api.post(`/orders/${order.id}/items`, { items });
      setCart([]);
      alert('Order submitted successfully! Kitchen will prepare your food.');
      loadInitialData();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order');
    }
  };

  const submitPayment = async () => {
    try {
      await api.post(`/orders/${order.id}/submit-payment`, {
        payment_method: paymentMethod,
        payment_slip: paymentMethod === 'BANK_TRANSFER' ? paymentSlip : null
      });
      alert('Payment submitted! Please wait for cashier verification.');
      setShowPayment(false);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment');
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory && p.available)
    : products.filter(p => p.available);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (order?.status === 'PAID') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your visit!</p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Table {table?.table_number}</p>
            <p className="text-2xl font-bold text-green-600">
              {order?.total_amount?.toLocaleString()} MMK
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Our waiter will clean your table shortly. Have a great day! 🎉
          </p>
        </div>
      </div>
    );
  }

  if (showPayment) {
    // If no order exists yet
    if (!order || !order.items || order.items.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-700">No Order to Pay</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed an order yet. Please add items to your cart and place an order first!
            </p>
            <button
              onClick={() => setShowPayment(false)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700"
            >
              Browse Menu
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span>Table {table?.table_number}</span>
              <span className="font-bold">Order #{order?.id}</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 text-center mt-4">
              Total: {order?.total_amount?.toLocaleString()} MMK
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            {paymentMethod === 'BANK_TRANSFER' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Payment Slip (Base64 or URL)
                </label>
                <textarea
                  value={paymentSlip}
                  onChange={(e) => setPaymentSlip(e.target.value)}
                  placeholder="Paste payment slip data or URL here..."
                  className="w-full p-3 border rounded-lg"
                  rows="4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For testing: paste any text or image URL
                </p>
              </div>
            )}

            <button
              onClick={submitPayment}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              Submit Payment
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
            >
              Back to Menu
            </button>
          </div>

          {order?.payment_slip && !order?.payment_verified && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                ⏳ Payment submitted! Waiting for cashier verification...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentStatus = getOrderItemStatus();
  const statusDisplay = currentStatus ? getStatusDisplay(currentStatus) : null;

  // Order Status Modal
  if (showOrderStatus) {
    // If no order exists yet
    if (!order || !order.items || order.items.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">Order Status</h1>
              <button
                onClick={() => setShowOrderStatus(false)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                ← Back to Menu
              </button>
            </div>
          </div>

          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-700">No Order Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't placed an order yet. Browse the menu and add items to your cart!
              </p>
              <button
                onClick={() => setShowOrderStatus(false)}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700"
              >
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show order status
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Order Status</h1>
            <button
              onClick={() => setShowOrderStatus(false)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← Back to Menu
            </button>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">Table</p>
                <p className="text-3xl font-bold text-purple-600">{table?.table_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-2xl font-bold">{order.total_amount?.toLocaleString()} MMK</p>
              </div>
            </div>

            {/* Overall Status */}
            {statusDisplay && (
              <div className={`${statusDisplay.color} ${statusDisplay.animation} rounded-lg p-4 mb-6`}>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-4xl">{statusDisplay.icon}</span>
                  <span className="font-bold text-xl">{statusDisplay.text}</span>
                </div>
              </div>
            )}

            {/* Item Status List */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-4">📋 Your Items</h3>
              {order.items.map((item, idx) => {
                const itemStatus = getStatusDisplay(item.status);
                return (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.product_name_mm || item.name_mm}</p>
                      <p className="text-sm text-gray-500">{item.product_name_en || item.name_en}</p>
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity} × {item.price?.toLocaleString()} MMK</p>
                    </div>
                    <div className={`${itemStatus.color} ${itemStatus.animation} px-4 py-2 rounded-full font-bold text-center min-w-[140px]`}>
                      <div className="text-2xl">{itemStatus.icon}</div>
                      <div className="text-xs">{itemStatus.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Button */}
          {currentStatus === 'SERVED' && (
            <button
              onClick={() => {
                setShowOrderStatus(false);
                setShowPayment(true);
              }}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-xl shadow-lg hover:bg-green-600 animate-pulse"
            >
              💳 Proceed to Checkout
            </button>
          )}

          {currentStatus !== 'SERVED' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 font-semibold">
                ⏳ Please wait for your order to be ready before checkout
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center">Welcome!</h1>
          <p className="text-center text-purple-100">Table {table?.table_number}</p>
          
          {/* Testing Buttons - Always visible for testing */}
          <div className="mt-4 flex justify-center space-x-3">
            <button
              onClick={() => setShowOrderStatus(true)}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 shadow-lg"
            >
              📋 View My Order
            </button>
            <button
              onClick={() => setShowPayment(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 shadow-lg"
            >
              💳 Checkout
            </button>
          </div>
          
          {/* Order Status Animation */}
          {order && order.items && order.items.length > 0 && statusDisplay && (
            <div className={`mt-4 mx-auto max-w-md ${statusDisplay.color} rounded-lg p-4 ${statusDisplay.animation}`}>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">{statusDisplay.icon}</span>
                <span className="font-bold text-lg">{statusDisplay.text}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white shadow-sm p-4 overflow-x-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            >
              {cat.name_mm}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-1">{product.name_mm}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.name_en}</p>
            <p className="text-indigo-600 font-bold mb-3">{product.price} MMK</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Floating Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg">Cart ({cart.length})</span>
              <span className="text-2xl font-bold text-indigo-600">
                {cartTotal.toLocaleString()} MMK
              </span>
            </div>
            
            <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
              {cart.map(item => (
                <div key={item.product_id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{item.name_mm}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="w-8 h-8 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="w-8 h-8 bg-indigo-600 text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={submitOrder}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerInterface;
