"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const CHARS = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const BINARY = "01";
const FONT_SIZE = 12;

export function AsciiHeroBg() {
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
      // Mountain profile using multiple sine waves
      const h =
        Math.sin(nx * Math.PI * 2 + t * 0.2) * 0.15 +
        Math.sin(nx * Math.PI * 4.5 + t * 0.1) * 0.1 +
        Math.sin(nx * Math.PI * 7 + t * 0.15) * 0.06 +
        Math.cos(nx * Math.PI * 3 + t * 0.12) * 0.08;
      return h; // range roughly -0.4 to 0.4
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

      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * FONT_SIZE;
          const y = row * FONT_SIZE;

          // Terrain: only bottom 60% of canvas
          const terrainStartRow = rows * 0.4;
          if (row < terrainStartRow) continue;

          // Normalized row within terrain area (0 = top of terrain zone, 1 = bottom)
          const terrainNorm = (row - terrainStartRow) / (rows - terrainStartRow);

          // Get mountain height at this column
          const mountainOffset = getTerrainHeight(col, cols, time);
          // threshold: rows below this value show characters
          const threshold = 0.3 + mountainOffset;

          if (terrainNorm < threshold * 0.6) continue;

          // Noise value for character selection
          const n = (noise(col, row, time) + 1) / 2; // 0 to 1

          // Distance from mouse
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let char: string;
          let alpha: number;

          if (dist < mouseRadius) {
            // Binary lens distortion zone
            const influence = 1 - dist / mouseRadius;
            char = BINARY[Math.floor(Math.random() * BINARY.length)];
            alpha = 0.4 + influence * 0.6;
          } else {
            // Terrain chars: denser at bottom, sparser near top of terrain
            const density = terrainNorm;
            const charIndex = Math.floor(n * density * (CHARS.length - 1));
            char = CHARS[charIndex] || " ";

            // Alpha based on depth + noise
            alpha = 0.08 + terrainNorm * 0.45 + n * 0.15;
          }

          if (char === " ") continue;

          if (isDark) {
            ctx.fillStyle = `rgba(0, 229, 168, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          }

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
