import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  getCategoriesWithProducts, 
  startOrder, 
  getOrder, 
  addItemsToOrder,
  searchProducts 
} from '../services/api';

const OrderInterface = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber, orderId } = location.state || {};

  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, [tableId, orderId]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories and products
      const categoriesResponse = await getCategoriesWithProducts();
      setCategories(categoriesResponse.data);

      // Load or create order
      if (orderId) {
        const orderResponse = await getOrder(orderId);
        setCurrentOrder(orderResponse.data);
      } else {
        const orderResponse = await startOrder(tableId);
        setCurrentOrder(orderResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      const response = await searchProducts(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name_mm: product.name_mm,
        name_en: product.name_en,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const sendToKitchen = async () => {
    if (cart.length === 0) {
      alert('ကျေးဇူးပြု၍ ပစ္စည်းထည့်ပါ / Please add items to cart');
      return;
    }

    try {
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await addItemsToOrder(currentOrder.id, items);
      alert('မီးဖိုချောင်သို့ ပို့ပြီးပါပြီ! / Sent to kitchen!');
      setCart([]);
      loadData(); // Reload to update totals
    } catch (error) {
      console.error('Error sending to kitchen:', error);
      alert('အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့သည် / Error occurred');
    }
  };

  const goToCheckout = () => {
    navigate(`/checkout/${currentOrder.id}`, { 
      state: { tableNumber } 
    });
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

  const displayProducts = searchQuery ? searchResults : 
    selectedCategory ? categories.find(c => c.category_id === selectedCategory)?.products || [] : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← နောက်သို့ / Back
            </button>
            <h1 className="text-xl font-bold">
              စားပွဲ {tableNumber} / Table {tableNumber}
            </h1>
            <div className="w-16"></div>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ရှာရန် ရိုက်ထည့်ပါ... / Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="overflow-x-auto">
            <div className="flex gap-2 px-4 pb-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                အားလုံး / All
              </button>
              {categories.map((category) => (
                <button
                  key={category.category_id}
                  onClick={() => setSelectedCategory(category.category_id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === category.category_id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {category.category_name_mm}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pb-32">
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {!searchQuery && selectedCategory === null ? (
            // Show all categories and products
            categories.map((category) => (
              <React.Fragment key={category.category_id}>
                <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-4 mb-2">
                  <h2 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2">
                    {category.category_name_mm}
                  </h2>
                </div>
                {category.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-left"
                  >
                    <div className="font-semibold text-gray-800 mb-1 text-sm">
                      {product.name_mm}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {product.name_en}
                    </div>
                    <div className="text-blue-600 font-bold">
                      {formatPrice(product.price)} Ks
                    </div>
                  </button>
                ))}
              </React.Fragment>
            ))
          ) : (
            // Show filtered products
            displayProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-left"
              >
                <div className="font-semibold text-gray-800 mb-1 text-sm">
                  {product.name_mm}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {product.name_en}
                </div>
                <div className="text-blue-600 font-bold">
                  {formatPrice(product.price)} Ks
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Cart Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="p-4">
          {/* Cart Items */}
          {cart.length > 0 && (
            <div className="mb-3 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between mb-2 bg-gray-50 p-2 rounded">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.name_mm}</div>
                    <div className="text-xs text-gray-600">{formatPrice(item.price)} Ks</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="bg-gray-300 hover:bg-gray-400 w-8 h-8 rounded"
                    >
                      -
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="bg-gray-300 hover:bg-gray-400 w-8 h-8 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Totals and Actions */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-600">
                လက်ရှိစာရင်း / Current Total
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {formatPrice(calculateCartTotal())} Ks
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={sendToKitchen}
              disabled={cart.length === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
            >
              မီးဖိုချောင်သို့ ပို့မည်
              <br />
              <span className="text-sm">Send to Kitchen</span>
            </button>
            <button
              onClick={goToCheckout}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            >
              ငွေရှင်းမည်
              <br />
              <span className="text-sm">Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInterface;
