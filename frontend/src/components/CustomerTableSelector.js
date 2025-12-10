import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CustomerTableSelector() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await api.get('/tables');
      setTables(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tables:', error);
      setLoading(false);
    }
  };

  const selectTable = (tableId) => {
    navigate(`/customer/${tableId}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Select Your Table
          </h1>
          <p className="text-lg text-gray-600">
            Choose a table to start ordering / စားပွဲတစ်ခုရွေးပြီး မှာယူပါ
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => selectTable(table.id)}
              className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all ${
                table.status === 'FREE'
                  ? 'bg-white hover:shadow-2xl'
                  : 'bg-gray-100 opacity-60 cursor-not-allowed'
              }`}
              disabled={table.status !== 'FREE' && !table.order_id}
            >
              <div className="text-4xl mb-3">
                {table.status === 'FREE' ? '🪑' : '🔴'}
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">
                Table {table.table_number}
              </p>
              <p className={`text-sm font-semibold ${
                table.status === 'FREE' ? 'text-green-600' : 'text-red-600'
              }`}>
                {table.status === 'FREE' ? 'Available' : 'Occupied'}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-2">📱 Scan QR Code</h3>
          <p className="text-gray-600 text-sm">
            In real scenario, customers can scan QR code on their table to directly access the menu.
            <br />
            For testing, please select a table above.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerTableSelector;
