import { useDeferredValue, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/shop.js';
import { CategorySidebar } from '../components/products/CategorySidebar.jsx';
import { ProductCard } from '../components/products/ProductCard.jsx';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const deferredSearch = useDeferredValue(search);
  const deferredCategory = useDeferredValue(category);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts({ search: deferredSearch, category: deferredCategory }),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [deferredSearch, deferredCategory]);

  const handleCategoryChange = (nextCategory) => {
    const params = new URLSearchParams(searchParams);
    if (nextCategory) {
      params.set('category', nextCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CategorySidebar categories={categories} activeCategory={category} onSelectCategory={handleCategoryChange} />

        <div className="space-y-4">
          <section className="card overflow-hidden">
            <div className="grid gap-4 bg-linear-to-r from-[#f8fbff] via-white to-[#eef5ff] p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <p className="inline-flex rounded-full bg-[#e8f0fe] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--fk-blue)]">
                  Flipkart Clone Store
                </p>
                <h1 className="text-3xl font-bold leading-tight text-[#172337] sm:text-4xl">
                  Find great deals across mobiles, laptops, fashion and more
                </h1>
                <p className="max-w-2xl text-sm text-[var(--fk-muted)] sm:text-base">
                  Built around the assignment essentials: fast browsing, product detail pages, cart management, checkout, and order placement with a Flipkart-inspired look and feel.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--fk-blue)] p-6 text-white">
                <p className="text-sm font-medium text-white/80">Deals of the Day</p>
                <h2 className="mt-2 text-2xl font-bold">Up to 64% off</h2>
                <p className="mt-2 text-sm text-white/90">Curated products seeded from multiple categories so every assignment flow is testable.</p>
              </div>
            </div>
          </section>

          <section className="card p-4">
            <div className="flex flex-col gap-2 border-b border-black/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">Showing {products.length} products</h2>
                <p className="mt-1 text-sm text-[var(--fk-muted)]">
                  {search ? `Results for "${search}"` : 'Browse all seeded catalogue items'}
                </p>
              </div>
              {category ? (
                <p className="text-sm text-[var(--fk-muted)]">
                  Active category: <span className="font-medium text-[#212121]">{category}</span>
                </p>
              ) : null}
            </div>

            {loading ? (
              <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="card overflow-hidden">
                    <div className="shimmer h-56 w-full" />
                    <div className="space-y-3 p-4">
                      <div className="shimmer h-4 w-20 rounded-full" />
                      <div className="shimmer h-5 w-4/5 rounded-full" />
                      <div className="shimmer h-4 w-full rounded-full" />
                      <div className="shimmer h-4 w-2/3 rounded-full" />
                      <div className="shimmer h-6 w-1/2 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length ? (
              <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <h3 className="text-lg font-semibold">No matching products found</h3>
                <p className="mt-2 text-sm text-[var(--fk-muted)]">Try another search term or reset the category filter.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
