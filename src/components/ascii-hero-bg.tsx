"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const CHARS = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const TEAR_CHARS = "@#&%*+=!><";
const BINARY = "01";
const FONT_SIZE = 12;
const TEAR_WIDTH = 22;  // px outside clear zone that shows torn chars
const CLEAR_PAD = 6;    // px of silence inside the avoidRect boundary

interface AsciiHeroBgProps {
  avoidElRef?: React.RefObject<HTMLParagraphElement | null>;
}

/** Distance from point (px,py) to the nearest edge of rectangle r.
 *  Returns 0 if the point is inside or on the rect. */
function distToRect(
  px: number, py: number,
  r: { x: number; y: number; w: number; h: number }
): number {
  const dx = Math.max(r.x - px, 0, px - (r.x + r.w));
  const dy = Math.max(r.y - py, 0, py - (r.y + r.h));
  return Math.sqrt(dx * dx + dy * dy);
}

export function AsciiHeroBg({ avoidElRef }: AsciiHeroBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function noise(x: number, y: number, t: number): number {
      return (
        Math.sin(x * 0.05 + t * 0.3) * 0.3 +
        Math.cos(y * 0.04 + t * 0.2) * 0.3 +
        Math.sin((x + y) * 0.03 + t * 0.15) * 0.2 +
        Math.cos((x - y) * 0.06 + t * 0.25) * 0.2
      );
    }

    function getTerrainHeight(col: number, cols: number, t: number): number {
      const nx = col / cols;
      return (
        Math.sin(nx * Math.PI * 2 + t * 0.2) * 0.15 +
        Math.sin(nx * Math.PI * 4.5 + t * 0.1) * 0.1 +
        Math.sin(nx * Math.PI * 7 + t * 0.15) * 0.06 +
        Math.cos(nx * Math.PI * 3 + t * 0.12) * 0.08
      );
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = themeRef.current !== "light";
      const cols = Math.floor(canvas.width / FONT_SIZE);
      const rows = Math.floor(canvas.height / FONT_SIZE);
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const mouseRadius = 150;

      // Compute avoidRect in canvas-local coords (updated every frame)
      let avoid: { x: number; y: number; w: number; h: number } | null = null;
      const avoidEl = avoidElRef?.current;
      if (avoidEl) {
        const canvasRect = canvas.getBoundingClientRect();
        const elRect = avoidEl.getBoundingClientRect();
        const rx = elRect.left - canvasRect.left;
        const ry = elRect.top - canvasRect.top;
        // Only apply when the element is actually visible over the canvas
        if (ry + elRect.height > 0 && ry < canvas.height && elRect.width > 0) {
          avoid = { x: rx, y: ry, w: elRect.width, h: elRect.height };
        }
      }

      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * FONT_SIZE;
          const y = row * FONT_SIZE;
          const cx = x + FONT_SIZE / 2;
          const cy = y + FONT_SIZE / 2;

          // ── Tear / avoid zone ──────────────────────────────────────────
          if (avoid) {
            // Per-cell jagged edge noise for irregular tear silhouette
            const jag =
              Math.sin(col * 2.71 + row * 1.91 + time * 0.25) * 3.5 +
              Math.cos(col * 4.13 - row * 3.37 + time * 0.18) * 2.5;

            const dist = distToRect(cx, cy, avoid) + jag;

            // Clear zone: silence inside the text rect
            if (dist < CLEAR_PAD) continue;

            // Torn-edge zone
            if (dist < TEAR_WIDTH) {
              const intensity = 1 - (dist - CLEAR_PAD) / (TEAR_WIDTH - CLEAR_PAD);
              const tearChar =
                TEAR_CHARS[Math.floor(Math.random() * TEAR_CHARS.length)];

              // Direction from rect center → outward displacement
              const rcx = avoid.x + avoid.w / 2;
              const rcy = avoid.y + avoid.h / 2;
              const vx = cx - rcx;
              const vy = cy - rcy;
              const vlen = Math.sqrt(vx * vx + vy * vy) || 1;
              const shiftX = (vx / vlen) * intensity * 6;
              const shiftY = (vy / vlen) * intensity * 4;

              const tearAlpha = 0.25 + intensity * 0.75;
              ctx.fillStyle = isDark
                ? `rgba(0,229,168,${tearAlpha})`
                : `rgba(0,0,0,${tearAlpha})`;
              ctx.fillText(tearChar, x + shiftX, y + shiftY);
              continue;
            }
          }

          // ── Normal terrain ─────────────────────────────────────────────
          const terrainStartRow = rows * 0.4;
          if (row < terrainStartRow) continue;

          const terrainNorm = (row - terrainStartRow) / (rows - terrainStartRow);
          const mountainOffset = getTerrainHeight(col, cols, time);
          const threshold = 0.3 + mountainOffset;
          if (terrainNorm < threshold * 0.6) continue;

          const n = (noise(col, row, time) + 1) / 2;

          // Distance from mouse
          const dxM = x - mouseX;
          const dyM = y - mouseY;
          const dist = Math.sqrt(dxM * dxM + dyM * dyM);

          let char: string;
          let alpha: number;

          if (dist < mouseRadius) {
            const influence = 1 - dist / mouseRadius;
            char = BINARY[Math.floor(Math.random() * BINARY.length)];
            alpha = 0.4 + influence * 0.6;
          } else {
            const density = terrainNorm;
            const charIndex = Math.floor(n * density * (CHARS.length - 1));
            char = CHARS[charIndex] || " ";
            alpha = 0.08 + terrainNorm * 0.45 + n * 0.15;
          }

          if (char === " ") continue;

          ctx.fillStyle = isDark
            ? `rgba(0,229,168,${alpha})`
            : `rgba(0,0,0,${alpha})`;
          ctx.fillText(char, x, y);
        }
      }

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [avoidElRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
