import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../api/shop.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency } from '../utils/format.js';
import { handleImageError } from '../utils/images.js';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="card h-[320px] animate-pulse bg-[#f7f7f7]" />;
  }

  return (
    <div className="space-y-4">
      <div className="card px-4 py-3">
        <h1 className="text-xl font-semibold">Your Orders</h1>
      </div>

      {!isAuthenticated ? (
        <div className="card py-16 text-center">
          <p className="text-lg font-semibold">Login to view your order history</p>
          <Link to="/auth?mode=login" className="mt-4 inline-flex text-sm font-medium text-[var(--fk-blue)]">
            Login now
          </Link>
        </div>
      ) : !orders.length ? (
        <div className="card py-16 text-center">
          <p className="text-lg font-semibold">No orders placed yet</p>
          <Link to="/" className="mt-4 inline-flex text-sm font-medium text-[var(--fk-blue)]">
            Start shopping
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card p-4">
            <div className="flex flex-col gap-3 border-b border-black/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Order ID: {order.id}</p>
                <p className="mt-1 text-sm text-[var(--fk-muted)]">
                  {new Date(order.createdAt).toLocaleString('en-IN')} • {order.status}
                </p>
              </div>
              <p className="text-base font-semibold">{formatCurrency(order.total)}</p>
            </div>
            <div className="divide-y divide-black/5 pt-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <img src={item.image} alt={item.productName} onError={handleImageError} className="h-[72px] w-[72px] rounded-sm object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.productName}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[var(--fk-muted)]">{item.productBrand}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Qty: {item.quantity}</p>
                    <p className="mt-1 font-semibold">{formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
