import { Heart, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/shop.js';
import { ProductGallery } from '../components/products/ProductGallery.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatCurrency } from '../utils/format.js';

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProduct(slug);
        setProduct(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setBusy(true);
      try {
      await addItem({ productId: product.id, quantity: 1, product });
      toast.success('Added to cart.');
      navigate('/cart');
    } finally {
      setBusy(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/auth?mode=signup', {
        state: {
          redirectTo: '/checkout',
          redirectState: {
            buyNowItems: [
              {
                productId: product.id,
                quantity: 1,
                product,
              },
            ],
          },
        },
      });
      return;
    }

    navigate('/checkout', {
      state: {
        buyNowItems: [
          {
            productId: product.id,
            quantity: 1,
            product,
          },
        ],
      },
    });
  };

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[520px_minmax(0,1fr)]">
        <div className="card p-4">
          <div className="shimmer h-[460px] rounded-sm" />
        </div>
        <div className="card p-5">
          <div className="space-y-4">
            <div className="shimmer h-4 w-24 rounded-full" />
            <div className="shimmer h-8 w-4/5 rounded-full" />
            <div className="shimmer h-4 w-full rounded-full" />
            <div className="shimmer h-10 w-1/2 rounded-full" />
            <div className="shimmer h-28 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold">{error || 'Product not found'}</p>
        <Link to="/" className="mt-4 inline-flex text-sm font-medium text-[var(--fk-blue)]">
          Go back to catalog
        </Link>
      </div>
    );
  }

  const wished = isWishlisted(product.id);

  return (
    <div className="space-y-4">
      <div className="text-sm text-[var(--fk-muted)]">
        <Link to="/" className="hover:text-[var(--fk-blue)]">Home</Link> / <span>{product.category.name}</span> / <span>{product.name}</span>
      </div>
      <section className="grid gap-4 lg:grid-cols-[520px_minmax(0,1fr)]">
        <div className="space-y-4">
          <ProductGallery images={product.images} title={product.name} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={busy || !product.stock}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#ff9f00] px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              style={{ backgroundColor: '#FF9F00', color: '#FFFFFF' }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.stock}
              className="inline-flex items-center justify-center rounded-sm bg-[#fb641b] px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              style={{ backgroundColor: '#FB641B', color: '#FFFFFF' }}
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-semibold shadow-sm ${
                wished ? 'border-red-200 bg-red-50 text-[var(--fk-danger)]' : 'border-black/10 bg-white text-[#212121]'
              }`}
            >
              <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
              {wished ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--fk-muted)]">{product.brand}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-[#212121]">{product.name}</h1>
          <p className="mt-2 text-sm text-[var(--fk-muted)]">{product.shortDescription}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--fk-success)] px-2 py-1 text-sm font-semibold text-white">
              {product.rating}
              <Star size={14} fill="currentColor" />
            </span>
            <span className="text-sm text-[var(--fk-muted)]">{product.reviewCount} ratings</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-lg text-[var(--fk-muted)] line-through">{formatCurrency(product.originalPrice)}</span>
            ) : null}
            {product.discountPercent ? (
              <span className="text-base font-semibold text-[var(--fk-success)]">{product.discountPercent}% off</span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 rounded-sm bg-[#f7faff] p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="text-[var(--fk-blue)]" size={18} />
              <span>Fast delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="text-[var(--fk-blue)]" size={18} />
              <span>Assured quality</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="text-[var(--fk-blue)]" size={18} />
              <span>{product.stock ? `${product.stock} left in stock` : 'Out of stock'}</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--fk-muted)]">{product.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Specifications</h2>
            <div className="mt-3 overflow-hidden rounded-sm border border-black/10">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-black/5 px-4 py-3 text-sm last:border-b-0">
                  <span className="capitalize text-[var(--fk-muted)]">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
