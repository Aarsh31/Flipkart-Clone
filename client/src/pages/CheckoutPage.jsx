import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/shop.js';
import { CheckoutForm } from '../components/checkout/CheckoutForm.jsx';
import { OrderSummaryCard } from '../components/cart/OrderSummaryCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/format.js';
import { handleImageError } from '../utils/images.js';

const defaultForm = {
  fullName: 'Demo Shopper',
  phoneNumber: '9876543210',
  addressLine: '221B, Market Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560001',
  landmark: 'Near Central Mall',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { cart, refreshCart } = useCart();
  const buyNowItems = useMemo(() => location.state?.buyNowItems || [], [location.state]);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isBuyNow = Boolean(buyNowItems.length);

  const summary = useMemo(() => {
    if (!isBuyNow) {
      return cart;
    }

    const subtotal = buyNowItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
    return {
      items: buyNowItems,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    };
  }, [cart, isBuyNow, buyNowItems]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=signup', {
        state: {
          redirectTo: '/checkout',
          redirectState: location.state || undefined,
        },
      });
      return;
    }

    if (!isBuyNow && !cart.items.length) {
      navigate('/cart');
    }
  }, [cart.items.length, isAuthenticated, isBuyNow, location.state, navigate]);

  useEffect(() => {
    if (user?.name) {
      setForm((current) => ({
        ...current,
        fullName: current.fullName === defaultForm.fullName ? user.name : current.fullName,
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const order = await createOrder({
        ...form,
        items: isBuyNow
          ? buyNowItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          : undefined,
      });

      if (!isBuyNow) {
        await refreshCart();
      }

      toast.success('Order placed successfully.');
      navigate(`/order-confirmation/${order.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        {error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        <CheckoutForm values={form} onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} />

        <div className="card p-4">
          <h2 className="section-title border-b border-black/5 pb-3">Order Summary</h2>
          <div className="divide-y divide-black/5">
            {summary.items.map((item) => {
              const product = item.product || item;
              return (
                <div key={product.id || item.productId} className="flex items-center gap-4 py-4">
                  <img src={product.thumbnail} alt={product.name} onError={handleImageError} className="h-20 w-20 rounded-sm object-contain" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-[var(--fk-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(product.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <OrderSummaryCard subtotal={summary.subtotal} shippingFee={summary.shippingFee} total={summary.total} />
    </div>
  );
}
