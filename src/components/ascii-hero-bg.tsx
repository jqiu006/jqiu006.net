"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const CHARS = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const BURST_CHARS = "@#&%*+=!><";
const BINARY = "01";
const FONT_SIZE = 12;

interface Disturbance {
  x: number;
  y: number;
  age: number;   // 0 → 1
  speed: number; // aging rate per frame
  radius: number;
}

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
    const disturbances: Disturbance[] = [];

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

      // ── Spawn new disturbance (low frequency) ─────────────────────────
      // ~0.4% chance per frame, max 4 simultaneous
      if (Math.random() < 0.004 && disturbances.length < 4) {
        disturbances.push({
          x: Math.random() * canvas.width,
          // Only spawn in the terrain zone (bottom 60%)
          y: canvas.height * (0.4 + Math.random() * 0.55),
          age: 0,
          speed: 0.006 + Math.random() * 0.008, // ~80–160 frame lifetime
          radius: 24 + Math.random() * 32,
        });
      }

      // Advance disturbance ages, remove dead ones
      for (let i = disturbances.length - 1; i >= 0; i--) {
        disturbances[i].age += disturbances[i].speed;
        if (disturbances[i].age >= 1) disturbances.splice(i, 1);
      }

      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * FONT_SIZE;
          const y = row * FONT_SIZE;

          // ── Disturbance overlay ─────────────────────────────────────
          let disturbed = false;
          for (const d of disturbances) {
            const dx = x - d.x;
            const dy = y - d.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < d.radius) {
              // Envelope: sin curve so it rises and falls smoothly
              const envelope = Math.sin(d.age * Math.PI);
              const localStrength = (1 - dist / d.radius) * envelope;
              if (localStrength < 0.05) break;

              // Outward displacement from disturbance centre
              const len = dist || 1;
              const shiftX = (dx / len) * localStrength * 5;
              const shiftY = (dy / len) * localStrength * 4;

              const burstChar =
                BURST_CHARS[Math.floor(Math.random() * BURST_CHARS.length)];
              const alpha = 0.2 + localStrength * 0.8;

              ctx.fillStyle = isDark
                ? `rgba(0,229,168,${alpha})`
                : `rgba(0,0,0,${alpha})`;
              ctx.fillText(burstChar, x + shiftX, y + shiftY);
              disturbed = true;
              break;
            }
          }
          if (disturbed) continue;

          // ── Normal terrain ──────────────────────────────────────────
          const terrainStartRow = rows * 0.4;
          if (row < terrainStartRow) continue;

          const terrainNorm = (row - terrainStartRow) / (rows - terrainStartRow);
          const mountainOffset = getTerrainHeight(col, cols, time);
          const threshold = 0.3 + mountainOffset;
          if (terrainNorm < threshold * 0.6) continue;

          const n = (noise(col, row, time) + 1) / 2;

          const dxM = x - mouseX;
          const dyM = y - mouseY;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          let char: string;
          let alpha: number;

          if (distM < mouseRadius) {
            const influence = 1 - distM / mouseRadius;
            char = BINARY[Math.floor(Math.random() * BINARY.length)];
            alpha = 0.4 + influence * 0.6;
          } else {
            const charIndex = Math.floor(n * terrainNorm * (CHARS.length - 1));
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
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
