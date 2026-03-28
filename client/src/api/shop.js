import { api } from './client.js';
import { localizeCart, localizeOrder, localizeProduct } from '../utils/productAssets.js';

export const fetchCategories = async () => (await api.get('/categories')).data;
export const fetchProducts = async (params = {}) => ((await api.get('/products', { params })).data).map(localizeProduct);
export const fetchProduct = async (slug) => localizeProduct((await api.get(`/products/${slug}`)).data);
export const fetchCart = async () => localizeCart((await api.get('/cart')).data);
export const addToCart = async (payload) => localizeCart((await api.post('/cart/items', payload)).data);
export const updateCartItem = async (itemId, payload) => localizeCart((await api.patch(`/cart/items/${itemId}`, payload)).data);
export const removeCartItem = async (itemId) => localizeCart((await api.delete(`/cart/items/${itemId}`)).data);
export const createOrder = async (payload) => localizeOrder((await api.post('/orders', payload)).data);
export const fetchOrder = async (orderId) => localizeOrder((await api.get(`/orders/${orderId}`)).data);
export const fetchOrders = async () => ((await api.get('/orders')).data).map(localizeOrder);
export const signup = async (payload) => (await api.post('/auth/signup', payload)).data;
export const login = async (payload) => (await api.post('/auth/login', payload)).data;
export const fetchMe = async () => (await api.get('/auth/me')).data;
export const syncGuestCart = async (payload) => (await api.post('/auth/sync-cart', payload)).data;
