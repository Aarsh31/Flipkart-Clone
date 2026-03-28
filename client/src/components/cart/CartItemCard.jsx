import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format.js';

export function CartItemCard({ item, onUpdate, onRemove, busy }) {
  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row">
      <Link to={`/products/${item.product.slug}`} className="mx-auto block w-full max-w-[180px] flex-shrink-0 sm:mx-0">
        <img src={item.product.thumbnail} alt={item.product.name} className="h-40 w-full object-contain" />
      </Link>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--fk-muted)]">{item.product.brand}</p>
          <Link to={`/products/${item.product.slug}`} className="mt-1 block text-base font-medium hover:text-[var(--fk-blue)]">
            {item.product.name}
          </Link>
          <p className="mt-1 text-sm text-[var(--fk-muted)]">{item.product.shortDescription}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{formatCurrency(item.product.price)}</span>
          {item.product.originalPrice ? (
            <span className="text-sm text-[var(--fk-muted)] line-through">{formatCurrency(item.product.originalPrice)}</span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-black/10">
            <button type="button" disabled={busy || item.quantity === 1} onClick={() => onUpdate(item.id, item.quantity - 1)} className="px-3 py-2 disabled:opacity-40">
              <Minus size={14} />
            </button>
            <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>
            <button type="button" disabled={busy} onClick={() => onUpdate(item.id, item.quantity + 1)} className="px-3 py-2 disabled:opacity-40">
              <Plus size={14} />
            </button>
          </div>
          <button type="button" disabled={busy} onClick={() => onRemove(item.id)} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fk-danger)] disabled:opacity-40">
            <Trash2 size={16} />
            Remove
          </button>
          <span className="text-sm text-[var(--fk-muted)]">Line total: {formatCurrency(item.lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
