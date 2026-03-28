import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItemCard } from '../components/cart/CartItemCard.jsx';
import { OrderSummaryCard } from '../components/cart/OrderSummaryCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateItem, removeItem, isGuestCart } = useCart();
  const [busyItemId, setBusyItemId] = useState('');

  const handleUpdate = async (itemId, quantity) => {
    setBusyItemId(itemId);
    try {
      await updateItem(itemId, quantity);
    } finally {
      setBusyItemId('');
    }
  };

  const handleRemove = async (itemId) => {
    setBusyItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setBusyItemId('');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="card p-4">
            <div className="shimmer h-7 w-56 rounded-full" />
          </div>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="card p-4">
              <div className="flex gap-4">
                <div className="shimmer h-40 w-40 rounded-sm" />
                <div className="flex-1 space-y-3">
                  <div className="shimmer h-4 w-20 rounded-full" />
                  <div className="shimmer h-5 w-3/4 rounded-full" />
                  <div className="shimmer h-4 w-full rounded-full" />
                  <div className="shimmer h-8 w-1/3 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <div className="shimmer h-7 w-32 rounded-full" />
          <div className="mt-4 space-y-3">
            <div className="shimmer h-4 w-full rounded-full" />
            <div className="shimmer h-4 w-full rounded-full" />
            <div className="shimmer h-10 w-full rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="card py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[var(--fk-muted)]">Add products from the catalog to continue shopping.</p>
        <Link to="/" className="mt-5 inline-flex rounded-sm bg-[var(--fk-blue)] px-5 py-3 text-sm font-semibold text-white">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div className="card px-4 py-3">
          <h1 className="text-xl font-semibold">Shopping Cart ({cart.items.length} items)</h1>
        </div>
        {cart.items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            busy={busyItemId === item.id}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <OrderSummaryCard
        subtotal={cart.subtotal}
        shippingFee={cart.shippingFee}
        total={cart.total}
        action={
          <>
            {isGuestCart ? (
              <p className="mt-4 rounded-sm bg-[#fff7e6] px-3 py-2 text-sm text-[#9a6700]">
                You can keep adding items as a guest. Login or signup is required only when you place the order.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() =>
                isAuthenticated
                  ? navigate('/checkout')
                  : navigate('/auth?mode=signup', {
                      state: {
                        redirectTo: '/checkout',
                      },
                    })
              }
              className="mt-4 w-full rounded-sm bg-[#fb641b] px-4 py-3 text-sm font-semibold text-white"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Continue'}
            </button>
          </>
        }
      />
    </div>
  );
}
