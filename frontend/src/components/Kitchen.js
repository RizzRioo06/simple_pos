import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Kitchen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadKitchenItems();
    const interval = setInterval(loadKitchenItems, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadKitchenItems = async () => {
    try {
      const response = await api.get('/orders/kitchen/pending');
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading kitchen items:', error);
      setLoading(false);
    }
  };

  const receiveOrder = async (itemId) => {
    try {
      await api.patch(`/orders/items/${itemId}/receive`);
      loadKitchenItems();
    } catch (error) {
      console.error('Error receiving order:', error);
      alert('Failed to receive order');
    }
  };

  const startCooking = async (itemId) => {
    try {
      await api.patch(`/orders/items/${itemId}/start-cooking`);
      loadKitchenItems();
    } catch (error) {
      console.error('Error starting cooking:', error);
      alert('Failed to start cooking');
    }
  };

  const markDone = async (itemId) => {
    try {
      await api.patch(`/orders/items/${itemId}/done-cooking`);
      loadKitchenItems();
    } catch (error) {
      console.error('Error marking as done:', error);
      alert('Failed to mark as done');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'RECEIVED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COOKING': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'DONE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'အသစ် / New';
      case 'RECEIVED': return 'လက်ခံပြီး / Received';
      case 'COOKING': return 'ချက်နေ / Cooking';
      case 'DONE': return 'ချက်ပြီး / Done';
      default: return status;
    }
  };

  const renderActionButton = (item) => {
    switch (item.status) {
      case 'PENDING':
        return (
          <button
            onClick={() => receiveOrder(item.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            လက်ခံမယ်
            <br />
            <span className="text-xs">Receive</span>
          </button>
        );
      case 'RECEIVED':
        return (
          <button
            onClick={() => startCooking(item.id)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ချက်မယ်
            <br />
            <span className="text-xs">Start Cook</span>
          </button>
        );
      case 'COOKING':
        return (
          <button
            onClick={() => markDone(item.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ပြီးပြီ
            <br />
            <span className="text-xs">Done</span>
          </button>
        );
      case 'DONE':
        return (
          <div className="text-center text-green-600 font-semibold">
            <div className="text-2xl">✓</div>
            <div className="text-xs">Ready to serve</div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← နောက်သို့ / Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              မီးဖိုချောင် / Kitchen
            </h1>
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              {items.length}
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm">Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-sm">Cooking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm">Done</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <div className="text-xl font-semibold text-gray-600">
              အားလုံး ပြီးစီးပါပြီ! / All orders completed!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4 ${
                  item.status === 'PENDING' ? 'border-yellow-500' :
                  item.status === 'RECEIVED' ? 'border-blue-500' :
                  item.status === 'COOKING' ? 'border-orange-500' :
                  'border-green-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-lg">
                      စားပွဲ {item.table_number}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-gray-800">
                      {item.quantity}×
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-gray-800">
                        {item.name_mm}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.name_en}
                      </div>
                    </div>
                  </div>

                  {renderActionButton(item)}
                </div>

                {/* Timestamps */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-500 space-y-1">
                  {item.received_at && (
                    <div>✓ Received: {new Date(item.received_at).toLocaleTimeString()}</div>
                  )}
                  {item.cooking_started_at && (
                    <div>🔥 Started: {new Date(item.cooking_started_at).toLocaleTimeString()}</div>
                  )}
                  {item.cooked_at && (
                    <div>✅ Done: {new Date(item.cooked_at).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
