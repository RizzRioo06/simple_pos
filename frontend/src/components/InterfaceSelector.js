import React from 'react';
import { useNavigate } from 'react-router-dom';

function InterfaceSelector() {
  const navigate = useNavigate();

  const interfaces = [
    {
      name: 'Customer',
      nameMm: 'ဧည့်သည်',
      icon: '👥',
      description: 'Browse menu & order food',
      descriptionMm: 'မီနူးကြည့်ပြီး အစားအစာမှာယူ',
      color: 'from-purple-500 to-indigo-600',
      path: '/customer-select'
    },
    {
      name: 'Waiter',
      nameMm: 'ဝေတာ',
      icon: '🍽️',
      description: 'Serve food & manage tables',
      descriptionMm: 'အစားအစာဆောင် & စားပွဲများစီမံ',
      color: 'from-green-500 to-teal-600',
      path: '/waiter'
    },
    {
      name: 'Kitchen',
      nameMm: 'မီးဖိုချောင်',
      icon: '👨‍🍳',
      description: 'Cook & prepare orders',
      descriptionMm: 'အစားအစာချက်ပြင်',
      color: 'from-orange-500 to-red-600',
      path: '/kitchen'
    },
    {
      name: 'Cashier',
      nameMm: 'ငွေကောင်တာ',
      icon: '💰',
      description: 'Process payments',
      descriptionMm: 'ငွေပေးချေမှုများစစ်ဆေး',
      color: 'from-pink-500 to-purple-600',
      path: '/cashier'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            POS System
          </h1>
          <p className="text-xl text-gray-600">
            Select Your Interface / သင့်အင်တာဖေ့စ်ကို ရွေးချယ်ပါ
          </p>
        </div>

        {/* Interface Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {interfaces.map((iface, index) => (
            <button
              key={index}
              onClick={() => navigate(iface.path)}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${iface.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {iface.icon}
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {iface.name}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {iface.nameMm}
                </p>
                
                {/* Description */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {iface.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {iface.descriptionMm}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Admin Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/tables')}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Admin: Table Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterfaceSelector;
