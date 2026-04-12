import { createContext, useContext, useRef, useCallback } from "react";

const CacheContext = createContext(null);

export function CacheProvider({ children }) {
  const store = useRef({});

  const get = useCallback((key) => {
    return store.current[key]?.data ?? null;
  }, []);

  const set = useCallback((key, data) => {
    store.current[key] = { data, ts: Date.now() };
  }, []);

  const invalidate = useCallback((keyOrPrefix) => {
    Object.keys(store.current).forEach((k) => {
      if (k === keyOrPrefix || k.startsWith(keyOrPrefix)) {
        delete store.current[k];
      }
    });
  }, []);

  return (
    <CacheContext.Provider value={{ get, set, invalidate }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error("useCache must be used inside <CacheProvider>");
  return ctx;
}