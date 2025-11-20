// Dev-only: filter out Vite HMR client noise like
// "[vite] connecting..." and "[vite] connected." from browser console.
// Does not affect build/production.

(() => {
  if (!import.meta?.env?.DEV) return;
  if (import.meta.env?.VITE_KEEP_VITE_LOGS === 'true') return;

  const shouldSilence = (args) => {
    try {
      for (const a of args) {
        if (typeof a === 'string' && a.trim().toLowerCase().startsWith('[vite]')) {
          return true;
        }
      }
    } catch {}
    return false;
  };

  const wrap = (method) => {
    const original = console[method];
    if (!original) return;
    console[method] = function (...args) {
      if (shouldSilence(args)) return;
      return original.apply(this, args);
    };
  };

  ['log', 'info', 'debug'].forEach(wrap);
})();

