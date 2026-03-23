"use client";

import { useRef, useEffect, useCallback, createElement } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";

interface ScrambleTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "p" | "span";
}

export function ScrambleText({ text, className, tag = "span" }: ScrambleTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const iterationRef = useRef(0);

  const scramble = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;

    const original = text;
    iterationRef.current = 0;

    const animate = () => {
      const iteration = iterationRef.current;
      const result = original
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < Math.floor(iteration)) {
            return original[index];
          }
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      el.textContent = result;

      if (iterationRef.current < original.length) {
        iterationRef.current += 0.35;
        frameRef.current = requestAnimationFrame(animate);
      } else {
        el.textContent = original;
        el.classList.remove("scrambling");
      }
    };

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    el.classList.add("scrambling");
    frameRef.current = requestAnimationFrame(animate);
  }, [text]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return createElement(
    tag,
    {
      ref: elementRef,
      className,
      onMouseEnter: scramble,
    },
    text
  );
}
