import { formatCurrency } from '../../utils/format.js';

export function OrderSummaryCard({ subtotal, shippingFee, total, action }) {
  return (
    <div className="card p-4">
      <h2 className="section-title border-b border-black/5 pb-3">Price Details</h2>
      <div className="space-y-3 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[var(--fk-muted)]">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--fk-muted)]">Delivery Charges</span>
          <span className={shippingFee === 0 ? 'font-medium text-[var(--fk-success)]' : ''}>
            {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
          </span>
        </div>
        <div className="border-t border-dashed border-black/10 pt-3">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total Amount</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}
