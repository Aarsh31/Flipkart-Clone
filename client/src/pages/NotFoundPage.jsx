import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="card py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--fk-muted)]">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-5 inline-flex rounded-sm bg-[var(--fk-blue)] px-5 py-3 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}
