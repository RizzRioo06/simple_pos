import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tables
export const getTables = () => api.get('/tables');
export const getTable = (id) => api.get(`/tables/${id}`);
export const updateTableStatus = (id, status) => api.patch(`/tables/${id}/status`, { status });

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoriesWithProducts = () => api.get('/categories/with-products');

// Products
export const getProducts = () => api.get('/products');
export const searchProducts = (query) => api.get(`/products/search?q=${encodeURIComponent(query)}`);
export const getProduct = (id) => api.get(`/products/${id}`);

// Orders
export const startOrder = (tableId) => api.post('/orders/start', { table_id: tableId });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const addItemsToOrder = (orderId, items) => api.post(`/orders/${orderId}/items`, { items });
export const getCheckoutInfo = (orderId) => api.get(`/orders/${orderId}/checkout`);
export const completeOrder = (orderId) => api.post(`/orders/${orderId}/complete`);
export const getKitchenItems = () => api.get('/orders/kitchen/pending');
export const markItemServed = (itemId) => api.patch(`/orders/items/${itemId}/serve`);

export default api;
