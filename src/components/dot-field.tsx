"use client";

import { useEffect, useRef } from "react";

interface Dot {
  ox: number;
  oy: number;
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  phase: number;  // random phase offset for idle drift
  freq: number;   // random oscillation frequency
  amp: number;    // random drift amplitude (px)
}

const SPACING = 44;
const ATTRACT_RADIUS = 160;
const LINE_RADIUS = 130;
const ATTRACT_STRENGTH = 0.12;
const SPRING = 0.07;
const IDLE_SPRING = 0.018;  // softer spring for idle drift target
const DAMPING = 0.72;
const DOT_RADIUS = 1.8;

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouseX = -9999;
    let mouseY = -9999;
    let dots: Dot[] = [];

    function buildDots() {
      dots = [];
      const cols = Math.ceil(canvas!.width / SPACING) + 1;
      const rows = Math.ceil(canvas!.height / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          dots.push({
            ox: x, oy: y,
            cx: x, cy: y,
            vx: 0, vy: 0,
            phase: Math.random() * Math.PI * 2,
            freq: 0.25 + Math.random() * 0.45,   // 0.25–0.7 Hz, slow drift
            amp: 2.5 + Math.random() * 4,         // 2.5–6.5 px displacement
          });
        }
      }
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      buildDots();
    }

    function getColor() {
      return document.documentElement.classList.contains("dark")
        ? "255,255,255"
        : "0,0,0";
    }

    function frame() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const color = getColor();
      const t = Date.now() * 0.001; // seconds

      for (const dot of dots) {
        const dxM = mouseX - dot.ox;
        const dyM = mouseY - dot.oy;
        const distM = Math.hypot(dxM, dyM);
        const nearMouse = distM < ATTRACT_RADIUS;

        if (nearMouse) {
          // Attract toward mouse cursor
          const force = 1 - distM / ATTRACT_RADIUS;
          dot.vx += dxM * force * ATTRACT_STRENGTH * 0.08;
          dot.vy += dyM * force * ATTRACT_STRENGTH * 0.08;
          // Spring back to strict origin when mouse is close
          dot.vx += (dot.ox - dot.cx) * SPRING;
          dot.vy += (dot.oy - dot.cy) * SPRING;
        } else {
          // Idle drift: spring toward a slowly oscillating target
          const restX = dot.ox + Math.sin(t * dot.freq + dot.phase) * dot.amp;
          const restY = dot.oy + Math.cos(t * dot.freq * 0.75 + dot.phase + 1.1) * dot.amp;
          dot.vx += (restX - dot.cx) * IDLE_SPRING;
          dot.vy += (restY - dot.cy) * IDLE_SPRING;
        }

        dot.vx *= DAMPING;
        dot.vy *= DAMPING;
        dot.cx += dot.vx;
        dot.cy += dot.vy;

        // Visuals: distance from current pos to cursor
        const dxV = mouseX - dot.cx;
        const dyV = mouseY - dot.cy;
        const distV = Math.hypot(dxV, dyV);

        // Line to cursor
        if (distV < LINE_RADIUS) {
          const lineAlpha = (1 - distV / LINE_RADIUS) * 0.45;
          ctx!.beginPath();
          ctx!.moveTo(dot.cx, dot.cy);
          ctx!.lineTo(mouseX, mouseY);
          ctx!.strokeStyle = `rgba(${color},${lineAlpha})`;
          ctx!.lineWidth = 0.6;
          ctx!.stroke();
        }

        // Dot
        const nearBoost = distV < ATTRACT_RADIUS ? (1 - distV / ATTRACT_RADIUS) * 0.5 : 0;
        ctx!.beginPath();
        ctx!.arc(dot.cx, dot.cy, DOT_RADIUS, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color},${0.22 + nearBoost})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    resize();
    frame();

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
