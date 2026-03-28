import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format.js';
import { useWishlist } from '../../context/WishlistContext.jsx';

export function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wished = isWishlisted(product.id);

  return (
    <div className="card group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm ${
          wished ? 'border-red-200 text-[var(--fk-danger)]' : 'border-black/10 text-[var(--fk-muted)]'
        }`}
      >
        <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
      </button>
      <Link to={`/products/${product.slug}`} className="bg-white p-4">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-52 w-full object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <Link to={`/products/${product.slug}`} className="flex flex-1 flex-col gap-2 border-t border-black/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--fk-muted)]">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm font-medium text-[#212121]">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-[var(--fk-muted)]">{product.shortDescription}</p>
        <div className="mt-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--fk-success)] px-1.5 py-0.5 text-xs font-semibold text-white">
            {product.rating}
            <Star size={12} fill="currentColor" />
          </span>
          <span className="text-xs text-[var(--fk-muted)]">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
          {product.originalPrice ? (
            <span className="text-sm text-[var(--fk-muted)] line-through">{formatCurrency(product.originalPrice)}</span>
          ) : null}
          {product.discountPercent ? (
            <span className="text-sm font-semibold text-[var(--fk-success)]">{product.discountPercent}% off</span>
          ) : null}
        </div>
      </Link>
    </div>
  );
}
