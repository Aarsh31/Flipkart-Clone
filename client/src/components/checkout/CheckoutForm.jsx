const inputClassName =
  'mt-1 w-full rounded-sm border border-black/10 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--fk-blue)] focus:ring-2 focus:ring-[#dce7ff]';

export function CheckoutForm({ values, onChange, onSubmit, submitting, title = 'Delivery Address' }) {
  return (
    <form onSubmit={onSubmit} className="card p-4 sm:p-5">
      <h2 className="section-title border-b border-black/5 pb-3">{title}</h2>
      <div className="grid gap-4 pt-4 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Full Name
          <input name="fullName" value={values.fullName} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium">
          Phone Number
          <input name="phoneNumber" value={values.phoneNumber} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Address Line
          <input name="addressLine" value={values.addressLine} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium">
          City
          <input name="city" value={values.city} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium">
          State
          <input name="state" value={values.state} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium">
          Postal Code
          <input name="postalCode" value={values.postalCode} onChange={onChange} className={inputClassName} required />
        </label>
        <label className="block text-sm font-medium">
          Landmark
          <input name="landmark" value={values.landmark} onChange={onChange} className={inputClassName} />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex rounded-sm bg-[#fb641b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
      >
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}
