/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addToCart, fetchCart, removeCartItem, syncGuestCart, updateCartItem } from '../api/shop.js';
import { useAuth } from './AuthContext.jsx';
import { localizeProduct } from '../utils/productAssets.js';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'flipkart_clone_guest_cart';

const emptyCart = { items: [], subtotal: 0, shippingFee: 0, total: 0 };

const deriveGuestCart = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 0 && subtotal < 500 ? 40 : 0;

  return {
    items: items.map((item) => ({
      ...item,
      lineTotal: item.product.price * item.quantity,
    })),
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await fetchCart();
        setCart(data);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const raw = window.localStorage.getItem(GUEST_CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      setCart(deriveGuestCart(items));
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    loadCart();
  }, [loadCart, token]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      isGuestCart: !isAuthenticated,
      refreshCart: loadCart,
      addItem: async (payload) => {
        if (!isAuthenticated) {
          const localized = localizeProduct(payload.product);
          const raw = window.localStorage.getItem(GUEST_CART_KEY);
          const current = raw ? JSON.parse(raw) : [];
          const existing = current.find((item) => item.product.id === localized.id);

          const nextItems = existing
            ? current.map((item) =>
                item.product.id === localized.id
                  ? { ...item, quantity: Math.min(item.quantity + payload.quantity, 10) }
                  : item,
              )
            : [...current, { id: `guest-${localized.id}`, product: localized, quantity: payload.quantity }];

          window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
          const nextCart = deriveGuestCart(nextItems);
          setCart(nextCart);
          return nextCart;
        }

        const data = await addToCart(payload);
        setCart(data);
        return data;
      },
      updateItem: async (itemId, quantity) => {
        if (!isAuthenticated) {
          const raw = window.localStorage.getItem(GUEST_CART_KEY);
          const current = raw ? JSON.parse(raw) : [];
          const nextItems = current.map((item) => (item.id === itemId ? { ...item, quantity } : item));
          window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
          const nextCart = deriveGuestCart(nextItems);
          setCart(nextCart);
          return nextCart;
        }

        const data = await updateCartItem(itemId, { quantity });
        setCart(data);
        return data;
      },
      removeItem: async (itemId) => {
        if (!isAuthenticated) {
          const raw = window.localStorage.getItem(GUEST_CART_KEY);
          const current = raw ? JSON.parse(raw) : [];
          const nextItems = current.filter((item) => item.id !== itemId);
          window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
          const nextCart = deriveGuestCart(nextItems);
          setCart(nextCart);
          return nextCart;
        }

        const data = await removeCartItem(itemId);
        setCart(data);
        return data;
      },
      syncGuestCart: async () => {
        const raw = window.localStorage.getItem(GUEST_CART_KEY);
        const items = raw ? JSON.parse(raw) : [];
        const authRaw = window.localStorage.getItem('flipkart_clone_auth');

        if (!items.length || !authRaw) {
          return;
        }

        await syncGuestCart({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        });

        window.localStorage.removeItem(GUEST_CART_KEY);
        const serverCart = await fetchCart();
        setCart(serverCart);
      },
    }),
    [cart, loading, isAuthenticated, loadCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
