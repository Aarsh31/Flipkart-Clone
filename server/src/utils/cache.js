const store = new Map();

const getCachedValue = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

const setCachedValue = (key, value, ttlMs = 30000) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

const clearCache = () => store.clear();

module.exports = { getCachedValue, setCachedValue, clearCache };
