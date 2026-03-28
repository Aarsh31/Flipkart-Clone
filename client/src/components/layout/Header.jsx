import { Heart, LogOut, MapPin, Search, ShoppingCart, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const { items } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = formData.get('search')?.toString().trim() || '';
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    navigate(`/?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 bg-[var(--fk-blue)] text-white shadow-md">
      <div className="page-shell flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 rounded-md bg-[var(--fk-yellow)] px-4 py-2 text-sm font-semibold text-[#1c1c1c]">
            <Store size={18} />
            <span>Flipkart</span>
          </Link>
          <form onSubmit={handleSearch} className="hidden flex-1 lg:flex lg:min-w-[560px]">
            <div className="flex w-full items-center rounded-sm bg-white px-3 shadow-sm">
              <Search className="text-[var(--fk-blue)]" size={18} />
              <input
                name="search"
                defaultValue={currentSearch}
                placeholder="Search for Products, Brands and More"
                className="w-full border-none px-3 py-2.5 text-sm text-[#212121] outline-none"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <div className="hidden items-center gap-1 text-white/90 md:flex">
            <MapPin size={16} />
            <span>Deliver to India</span>
          </div>
          {isAuthenticated ? (
            <NavLink to="/orders" className="hidden sm:inline-flex whitespace-nowrap">
              Orders
            </NavLink>
          ) : (
            <NavLink to="/auth" className="hidden sm:inline-flex whitespace-nowrap">
              Login
            </NavLink>
          )}
          <NavLink to="/wishlist" className="hidden items-center gap-1 whitespace-nowrap sm:inline-flex">
            <Heart size={16} />
            Wishlist ({items.length})
          </NavLink>
          <NavLink
            to="/cart"
            className="inline-flex min-w-[148px] items-center justify-center gap-2 rounded-sm bg-[var(--fk-yellow)] px-4 py-2 font-semibold whitespace-nowrap text-[#172337] shadow-sm ring-1 ring-black/10"
            style={{ backgroundColor: '#F8E831', color: '#172337' }}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-[#172337]">{cart.items.length}</span>
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-white/20 px-3 py-2 text-white/95 hover:bg-white/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'} | Logout</span>
              <span className="sm:hidden">Logout</span>
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSearch} className="flex lg:hidden">
          <div className="flex w-full items-center rounded-sm bg-white px-3 shadow-sm">
            <Search className="text-[var(--fk-blue)]" size={18} />
            <input
              name="search"
              defaultValue={currentSearch}
              placeholder="Search for Products, Brands and More"
              className="w-full border-none px-3 py-2.5 text-sm text-[#212121] outline-none"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
