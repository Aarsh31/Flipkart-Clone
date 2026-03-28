import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from './Header.jsx';

export function AppLayout() {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--fk-page)]">
      <Header />
      <main className="page-shell py-4 sm:py-5">
        {loading ? (
          <div className="space-y-4">
            <div className="card p-6">
              <div className="shimmer h-12 w-2/3 rounded-full" />
              <div className="mt-4 shimmer h-5 w-full rounded-full" />
              <div className="mt-2 shimmer h-5 w-4/5 rounded-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="shimmer h-56 w-full" />
                  <div className="space-y-3 p-4">
                    <div className="shimmer h-4 w-20 rounded-full" />
                    <div className="shimmer h-5 w-4/5 rounded-full" />
                    <div className="shimmer h-4 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
