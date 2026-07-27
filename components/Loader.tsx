'use client';

import { useEffect, useRef } from 'react';

/**
 * Page Loader — shows on first load, fades out after 1.6s.
 */
export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const timeout = setTimeout(() => {
      loader.classList.add('hidden');
    }, 1600);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={loaderRef} className="page-loader" aria-hidden="true">
      <div className="loader-logo">RG</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
          LOADING
        </span>
      </div>
    </div>
  );
}
