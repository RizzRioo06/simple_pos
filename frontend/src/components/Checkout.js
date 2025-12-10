import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCheckoutInfo, completeOrder } from '../services/api';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadCheckoutInfo();
  }, [orderId]);

  const loadCheckoutInfo = async () => {
    try {
      const response = await getCheckoutInfo(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading checkout info:', error);
      setLoading(false);
    }
  };

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleCloseTable = async () => {
    if (window.confirm('သေချာပါသလား? ငွေရှင်းပြီးပါပြီလား? / Confirm payment received?')) {
      try {
        await completeOrder(orderId);
        alert('စားပွဲပိတ်ပြီးပါပြီ! / Table closed successfully!');
        navigate('/');
      } catch (error) {
        console.error('Error closing table:', error);
        alert('အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့သည် / Error occurred');
      }
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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← နောက်သို့ / Back
            </button>
            <h1 className="text-xl font-bold">ငွေရှင်းခြင်း / Checkout</h1>
            <div className="w-16"></div>
          </div>

          <div className="text-center py-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">စားပွဲ / Table</div>
            <div className="text-3xl font-bold text-blue-600">{tableNumber}</div>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold mb-4 text-center border-b pb-2">
            ငွေတောင်းခံလွှာ / Receipt
          </h2>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">{item.name_mm}</div>
                  <div className="text-sm text-gray-600">{item.name_en}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-600">
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                  <div className="font-semibold">
                    {formatPrice(item.quantity * item.price)} Ks
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-300 pt-4 mt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>စုစုပေါင်း / Total</span>
              <span className="text-2xl text-green-600">
                {formatPrice(order.total_amount)} Ks
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="text-center text-sm text-gray-500 mt-4">
            {new Date(order.created_at).toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* QR Code Section */}
        {!showQR ? (
          <button
            onClick={handleShowQR}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg mb-4 transition"
          >
            QR Code ပြရန် / Show QR Code
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-center font-bold mb-4">
              QR Code ဖြင့် ပေးချေပါ / Pay with QR Code
            </h3>
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center mb-4">
              {/* Placeholder for QR Code - Replace with actual QR code image */}
              <div className="text-center p-8">
                <div className="text-6xl mb-2">📱</div>
                <div className="font-bold text-lg mb-2">KPay / WavePay</div>
                <div className="text-sm text-gray-600">
                  Place your QR Code image here
                  <br />
                  Example: /images/shop-qr.png
                </div>
              </div>
            </div>
            <div className="text-center text-gray-600 text-sm">
              QR ကုဒ်ဖြင့် ငွေလွှဲပြီးပါက "စားပွဲပိတ်မည်" ကို နှိပ်ပါ
              <br />
              Scan QR code and click "Close Table" after payment
            </div>
          </div>
        )}

        {/* Close Table Button */}
        <button
          onClick={handleCloseTable}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold text-lg transition"
        >
          စားပွဲပိတ်မည် / Close Table
        </button>

        <div className="text-center text-sm text-gray-500 mt-4">
          ကျေးဇူးတင်ပါသည်! / Thank you!
        </div>
      </div>
    </div>
  );
};

export default Checkout;
