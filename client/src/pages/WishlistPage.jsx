import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatCurrency } from '../utils/format.js';

export function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();

  if (!items.length) {
    return (
      <div className="card py-16 text-center">
        <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-[var(--fk-muted)]">Save products you want to revisit later.</p>
        <Link to="/" className="mt-5 inline-flex rounded-sm bg-[var(--fk-blue)] px-5 py-3 text-sm font-semibold text-white">
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card px-4 py-3">
        <h1 className="text-xl font-semibold">Wishlist ({items.length})</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <Link to={`/products/${item.slug}`} className="block bg-white p-4">
              <img src={item.thumbnail} alt={item.name} className="h-52 w-full object-contain" />
            </Link>
            <div className="space-y-2 border-t border-black/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--fk-muted)]">{item.brand}</p>
              <Link to={`/products/${item.slug}`} className="line-clamp-2 block text-sm font-medium hover:text-[var(--fk-blue)]">
                {item.name}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{formatCurrency(item.price)}</span>
                {item.originalPrice ? <span className="text-sm text-[var(--fk-muted)] line-through">{formatCurrency(item.originalPrice)}</span> : null}
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(item)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fk-danger)]"
              >
                <Heart size={16} fill="currentColor" />
                Remove from wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
