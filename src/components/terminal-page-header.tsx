"use client";

import { useRef, useEffect } from "react";

interface TerminalPageHeaderProps {
  sysLabel: string;
  title: string;
  subtitle?: string;
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

export function TerminalPageHeader({ sysLabel, title, subtitle }: TerminalPageHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const originalText = title;
    let frameId: number | null = null;
    let iteration = 0;

    function animate() {
      if (!el) return;
      const result = originalText
        .split("")
        .map((char, index) => {
          if (char === "\n" || char === " ") return char;
          if (index < Math.floor(iteration)) {
            return originalText[index];
          }
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      el.textContent = result;

      if (iteration < originalText.length) {
        iteration += 0.5;
        frameId = requestAnimationFrame(animate);
      } else {
        el.textContent = originalText;
        el.classList.remove("scrambling");
      }
    }

    function handleMouseEnter() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      iteration = 0;
      el!.classList.add("scrambling");
      frameId = requestAnimationFrame(animate);
    }

    el.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [title]);

  return (
    <div className="mb-12">
      <p className="sys-label mb-3">{sysLabel}</p>
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-black tracking-tight cursor-default"
        style={{ fontFamily: "'VT323', 'Inter', sans-serif" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-muted-foreground font-mono mt-4">{subtitle}</p>
      )}
      <div
        className="mt-6 h-px w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, oklch(0.7 0.15 160 / 30%) 0px, oklch(0.7 0.15 160 / 30%) 4px, transparent 4px, transparent 8px)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
