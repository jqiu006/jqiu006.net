"use client";

import { useEffect, useState } from "react";

export function BackgroundTitle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed top-40 left-8 md:left-16 lg:left-24 text-[clamp(4rem,12vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] pointer-events-none select-none z-0"
      style={{
        transformOrigin: 'left top',
        transform: 'scale(1.8) translateX(-6rem)',
        color: isDark ? 'oklch(0.3 0 0)' : 'oklch(0.8 0 0)',
        transition: 'color 0.3s ease-out',
      }}
      aria-hidden="true"
    >
      Jinhui<br />
      Qiu
    </div>
  );
}
