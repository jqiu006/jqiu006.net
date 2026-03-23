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
      className="fixed inset-0 pointer-events-none select-none z-0"
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        color: isDark ? "oklch(0.8 0.15 160)" : "oklch(0.4 0 0)",
        opacity: isDark ? 0.04 : 0.03,
        transition: "color 0.3s ease-out, opacity 0.3s ease-out",
      }}
      aria-hidden="true"
    />
  );
}
