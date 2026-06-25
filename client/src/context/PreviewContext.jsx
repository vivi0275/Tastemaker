import { createContext, useCallback, useContext, useRef, useState } from 'react';

const PreviewContext = createContext(null);

export function PreviewProvider({ children }) {
  const activeIdRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const registerPlay = useCallback((trackId, stopFn) => {
    if (activeIdRef.current && activeIdRef.current !== trackId) {
      window.dispatchEvent(
        new CustomEvent('tastemaker:preview-stop', { detail: { trackId: activeIdRef.current } })
      );
    }
    activeIdRef.current = trackId;
    setActiveId(trackId);
    return stopFn;
  }, []);

  const registerStop = useCallback((trackId) => {
    if (activeIdRef.current === trackId) {
      activeIdRef.current = null;
      setActiveId(null);
    }
  }, []);

  return (
    <PreviewContext.Provider value={{ activeId, registerPlay, registerStop }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreviewContext() {
  const ctx = useContext(PreviewContext);
  if (!ctx) {
    throw new Error('usePreviewContext must be used within PreviewProvider');
  }
  return ctx;
}
