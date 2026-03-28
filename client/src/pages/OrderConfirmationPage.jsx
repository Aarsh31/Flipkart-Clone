import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '../api/shop.js';
import { formatCurrency } from '../utils/format.js';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrder(orderId);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  if (loading) {
    return <div className="card h-[360px] animate-pulse bg-[#f7f7f7]" />;
  }

  if (!order) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold">Order not found.</p>
        <Link to="/" className="mt-4 inline-flex text-sm font-medium text-[var(--fk-blue)]">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-3xl p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="text-[var(--fk-success)]" size={56} />
        <h1 className="mt-4 text-3xl font-bold">Order placed successfully</h1>
        <p className="mt-2 text-sm text-[var(--fk-muted)]">
          Your order ID is <span className="font-semibold text-[#212121]">{order.id}</span>
        </p>
      </div>

      <div className="mt-8 grid gap-4 rounded-sm bg-[#f8faff] p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--fk-muted)]">Status</p>
          <p className="mt-1 font-medium">{order.status}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--fk-muted)]">Items</p>
          <p className="mt-1 font-medium">{order.items.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--fk-muted)]">Total</p>
          <p className="mt-1 font-medium">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/orders" className="rounded-sm bg-[var(--fk-blue)] px-5 py-3 text-sm font-semibold text-white">
          View order history
        </Link>
        <Link to="/" className="rounded-sm border border-black/10 px-5 py-3 text-sm font-semibold">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
