export function CategorySidebar({ categories, activeCategory, onSelectCategory }) {
  return (
    <aside className="card h-fit p-4">
      <h2 className="section-title border-b border-black/5 pb-3">Filters</h2>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--fk-muted)]">Categories</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className={`block w-full rounded-sm px-3 py-2 text-left text-sm ${
              activeCategory === '' ? 'bg-[#e8f0fe] font-semibold text-[var(--fk-blue)]' : 'hover:bg-black/5'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.slug)}
              className={`block w-full rounded-sm px-3 py-2 text-left text-sm ${
                activeCategory === category.slug ? 'bg-[#e8f0fe] font-semibold text-[var(--fk-blue)]' : 'hover:bg-black/5'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
