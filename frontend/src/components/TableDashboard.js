import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTables } from '../services/api';

const TableDashboard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTables();
    const interval = setInterval(loadTables, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tables:', error);
      setLoading(false);
    }
  };

  const handleTableClick = (table) => {
    if (table.status === 'FREE') {
      navigate(`/order/${table.id}`, { state: { tableNumber: table.table_number } });
    } else {
      navigate(`/order/${table.id}`, { state: { tableNumber: table.table_number, orderId: table.order_id } });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('my-MM').format(price);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">လက်ဖက်ရည်ဆိုင်</h1>
          <p className="text-center text-gray-600 mt-1">Burmese Tea Shop POS</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => navigate('/kitchen')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              မီးဖိုချောင် Kitchen
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>အလွတ် (Free)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>ရှိနေသည် (Occupied)</span>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`
                relative p-6 rounded-lg shadow-lg transition-all transform hover:scale-105
                ${table.status === 'FREE' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
                }
                text-white
              `}
            >
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  စားပွဲ {table.table_number}
                </div>
                <div className="text-sm opacity-90">
                  Table {table.table_number}
                </div>
                {table.status === 'OCCUPIED' && (
                  <div className="mt-3 pt-3 border-t border-white border-opacity-30">
                    <div className="text-xs opacity-80">လက်ရှိငွေစာရင်း</div>
                    <div className="text-xl font-bold mt-1">
                      {formatPrice(table.current_bill)} Ks
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableDashboard;
