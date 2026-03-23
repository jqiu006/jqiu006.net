"use client";

import { useEffect, useRef, useState } from "react";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://192.168.10.41:1337";

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
  const [href, setHref] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const SCRAMBLE = "!<>-_\\/[]{}—=+*^?#";
  const ORIGINAL = "resume";

  useEffect(() => {
    fetch(`${STRAPI_BASE}/api/resume?populate=*`)
      .then((r) => r.json())
      .then((json) => {
        const url =
          json?.data?.file?.url ??
          json?.data?.attributes?.file?.data?.attributes?.url ??
          null;
        if (url) setHref(url.startsWith("http") ? url : `${STRAPI_BASE}${url}`);
      })
      .catch(() => {});
  }, []);

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

  const Tag = href ? "a" : "span";
  const linkProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="sys-label opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
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
    </Tag>
  );
}
