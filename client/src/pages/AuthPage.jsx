import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const inputClassName =
  'mt-1 w-full rounded-sm border border-black/10 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--fk-blue)] focus:ring-2 focus:ring-[#dce7ff]';

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { syncGuestCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const switchMode = (nextMode) => {
    const params = new URLSearchParams(searchParams);
    params.set('mode', nextMode);
    setSearchParams(params);
    setError('');
  };

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
      if (mode === 'signup') {
        await signup(form);
        toast.success('Account created successfully.');
      } else {
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back.');
      }

      await syncGuestCart();

      const redirectTo = location.state?.redirectTo || '/';
      const redirectState = location.state?.redirectState || undefined;
      navigate(redirectTo, redirectState ? { state: redirectState } : undefined);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to continue right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="card overflow-hidden">
        <div className="bg-linear-to-br from-[#2874f0] to-[#1757c2] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Continue Shopping</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Sign in to place orders and keep your cart with you.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90">
            You can still browse and add products as a guest. We only ask you to sign in when it is time to checkout so your order history and email confirmation stay tied to your account.
          </p>
          <div className="mt-8 rounded-2xl bg-white/12 p-4 text-sm">
            <p className="font-semibold">Demo account</p>
            <p className="mt-2">Email: `demo@flipkartclone.local`</p>
            <p>Password: `Demo@123`</p>
          </div>
        </div>
      </section>

      <section className="card p-6 sm:p-8">
        <div className="flex gap-2 rounded-full bg-[#f3f7ff] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-[var(--fk-blue)] text-white' : 'text-[#172337]'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-[var(--fk-blue)] text-white' : 'text-[#172337]'}`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' ? (
            <label className="block text-sm font-medium">
              Full Name
              <input name="name" value={form.name} onChange={handleChange} className={inputClassName} required />
            </label>
          ) : null}

          <label className="block text-sm font-medium">
            Email Address
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClassName} required />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClassName} required />
          </label>

          {error ? <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm bg-[#fb641b] px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {submitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--fk-muted)]">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')} className="font-semibold text-[var(--fk-blue)]">
            {mode === 'signup' ? 'Login' : 'Create one'}
          </button>
        </p>

        <Link to="/" className="mt-6 inline-flex text-sm font-medium text-[var(--fk-blue)]">
          Continue browsing as guest
        </Link>
      </section>
    </div>
  );
}
