import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKitchenItems, markItemServed } from '../services/api';

const Kitchen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadKitchenItems();
    const interval = setInterval(loadKitchenItems, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadKitchenItems = async () => {
    try {
      const response = await getKitchenItems();
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading kitchen items:', error);
      setLoading(false);
    }
  };

  const handleMarkServed = async (itemId) => {
    try {
      await markItemServed(itemId);
      loadKitchenItems();
    } catch (error) {
      console.error('Error marking item as served:', error);
      alert('အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့သည် / Error occurred');
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'ခုနက / Just now';
    if (diffMins === 1) return '1 မိနစ် / 1 min ago';
    return `${diffMins} မိနစ် / ${diffMins} mins ago`;
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
      <div className="max-w-4xl mx-auto">
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

        {/* Pending Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <div className="text-xl font-semibold text-gray-600">
              အားလုံး ပြီးစီးပါပြီ! / All orders completed!
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-lg">
                        စားပွဲ {item.table_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTimeAgo(item.created_at)}
                      </div>
                    </div>
                    
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
                  </div>

                  <button
                    onClick={() => handleMarkServed(item.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition ml-4"
                  >
                    ပြီးပြီ
                    <br />
                    <span className="text-xs">Done</span>
                  </button>
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
