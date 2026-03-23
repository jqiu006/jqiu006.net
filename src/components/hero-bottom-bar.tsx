"use client";

import { useEffect, useRef, useState } from "react";

// ── Live clock ────────────────────────────────────────────────────────────────

export function HeroClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", { hour12: false });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="sys-label opacity-60 tabular-nums">
      {time || "--:--:--"}
    </span>
  );
}

// ── Resume link ───────────────────────────────────────────────────────────────

export function HeroResume() {
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const SCRAMBLE = "!<>-_\\/[]{}—=+*^?#";
  const ORIGINAL = "resume";

  function scrambleTo(target: string) {
    const el = labelRef.current;
    if (!el) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    let iteration = 0;
    function step() {
      if (!el) return;
      el.textContent = target
        .split("")
        .map((ch, i) => {
          if (ch === " ") return ch;
          if (i < Math.floor(iteration)) return target[i];
          return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        })
        .join("");
      if (iteration < target.length) {
        iteration += 0.5;
        frameRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    frameRef.current = requestAnimationFrame(step);
  }

  return (
    <a
      href="/api/resume"
      target="_blank"
      rel="noopener noreferrer"
      className="sys-label opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
      onMouseEnter={() => { setHovered(true); scrambleTo(ORIGINAL); }}
      onMouseLeave={() => { setHovered(false); scrambleTo(ORIGINAL); }}
    >
      <span ref={labelRef}>{ORIGINAL}</span>
      <span
        className="transition-all duration-200 overflow-hidden inline-block"
        style={{ width: hovered ? "1em" : 0, opacity: hovered ? 1 : 0 }}
        aria-hidden
      >
        ↗
      </span>
    </a>
  );
}
