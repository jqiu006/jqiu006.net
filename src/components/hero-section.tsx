"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AsciiHeroBg } from "./ascii-hero-bg";

interface HeroSectionProps {
  name: string;
  taglineDark: string;
  taglineLight: string;
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

export function HeroSection({ name, taglineDark, taglineLight }: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [wasAbsolute, setWasAbsolute] = useState(true);
  const taglineInitialized = useRef(false);

  // Tagline: set on first theme resolve, scramble on subsequent theme changes
  useEffect(() => {
    const el = heroSubtitleRef.current;
    if (!el || !resolvedTheme) return;

    const newTagline = resolvedTheme === "light" ? taglineLight : taglineDark;

    if (!taglineInitialized.current) {
      // First time: just set the text silently
      el.textContent = newTagline;
      taglineInitialized.current = true;
      return;
    }

    // Theme toggled: scramble from current text to new tagline
    const oldText = el.textContent || "";
    const length = Math.max(oldText.length, newTagline.length);
    let frameId: number | null = null;
    let iteration = 0;

    function animate() {
      const result = Array.from({ length }, (_, i) => {
        const target = newTagline[i] ?? "";
        if (target === " " || target === "") return target;
        if (i < Math.floor(iteration)) return target;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join("");

      el!.textContent = result;

      if (iteration < length) {
        iteration += 0.6;
        frameId = requestAnimationFrame(animate);
      } else {
        el!.textContent = newTagline;
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => { if (frameId !== null) cancelAnimationFrame(frameId); };
  }, [resolvedTheme, taglineDark, taglineLight]);

  // Scramble title on hover
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el) return;

    const originalText = el.textContent || "";
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

      // Preserve line breaks by using innerHTML with <br>
      el.innerHTML = result.replace(/\n/g, "<br />");

      if (iteration < originalText.length) {
        iteration += 0.35;
        frameId = requestAnimationFrame(animate);
      } else {
        // Restore with original line breaks
        const nameParts = name.replace(/\(.*?\)/g, "").trim().split(" ").filter(Boolean);
        el.innerHTML = nameParts[0] + (nameParts.slice(1).length ? "<br />" + nameParts.slice(1).join(" ") : "");
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
  }, [name]);

  // Scroll animation
  useEffect(() => {
    const heroTitle = heroTitleRef.current;
    const heroSubtitle = heroSubtitleRef.current;

    if (!heroTitle || !heroSubtitle) return;

    let ticking = false;

    function updateHeroTitle() {
      if (!heroTitle || !heroSubtitle) return;

      const scrollY = Math.max(window.scrollY || window.pageYOffset, 0);

      if (scrollY <= 10) {
        setWasAbsolute(true);

        heroTitle.style.position = "absolute";
        heroSubtitle.style.position = "absolute";

        heroTitle.style.top = "";
        heroSubtitle.style.top = "";
        heroTitle.style.left = "";
        heroSubtitle.style.left = "";

        heroTitle.style.transform = "scale(1) translateX(0)";
        heroSubtitle.style.transform = "scale(1)";

        heroSubtitle.style.opacity = "1";

        heroTitle.style.zIndex = "100";
        heroSubtitle.style.zIndex = "100";

        heroTitle.style.color = "";

        ticking = false;
        return;
      }

      if (scrollY > 10 && wasAbsolute) {
        const titleRect = heroTitle.getBoundingClientRect();
        const subtitleRect = heroSubtitle.getBoundingClientRect();

        heroTitle.style.position = "fixed";
        heroSubtitle.style.position = "fixed";

        heroTitle.style.top = `${titleRect.top}px`;
        heroTitle.style.left = `${titleRect.left}px`;

        heroSubtitle.style.top = `${subtitleRect.top}px`;
        heroSubtitle.style.left = `${subtitleRect.left}px`;

        setWasAbsolute(false);
      }

      const progress = Math.min(scrollY / 800, 1);

      const titleScale = 1 + progress * 0.8;
      const subtitleScale = 1 + progress * 0.4;
      const translateX = -progress * 6;

      heroTitle.style.transform = `scale(${titleScale}) translateX(${translateX}rem)`;
      heroSubtitle.style.transform = `scale(${subtitleScale})`;

      if (progress >= 1) {
        heroTitle.style.top = "10rem";
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1024) {
          heroTitle.style.left = "6rem";
        } else if (viewportWidth >= 768) {
          heroTitle.style.left = "4rem";
        } else {
          heroTitle.style.left = "2rem";
        }
      }

      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        const lightness = 0.985 - progress * 0.685;
        heroTitle.style.color = `oklch(${lightness} 0 0)`;
      } else {
        const lightness = 0.145 + progress * 0.655;
        heroTitle.style.color = `oklch(${lightness} 0 0)`;
      }

      const fadeOpacity = Math.max(1 - progress * 2, 0);
      heroSubtitle.style.opacity = `${fadeOpacity}`;

      if (scrollY > 100) {
        heroTitle.style.zIndex = "0";
        heroSubtitle.style.zIndex = "0";
      } else {
        heroTitle.style.zIndex = "100";
        heroSubtitle.style.zIndex = "100";
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroTitle);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick);
    window.addEventListener("resize", requestTick);

    const handleLoad = () => {
      window.scrollTo(0, 0);
      const scrollY = window.scrollY || window.pageYOffset || 0;

      if (scrollY <= 10) {
        setWasAbsolute(true);
        return;
      }

      setWasAbsolute(true);
      updateHeroTitle();
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      window.removeEventListener("load", handleLoad);
    };
  }, [wasAbsolute]);

  const cleanName = name.replace(/\(.*?\)/g, "").trim();
  const nameParts = cleanName.split(" ").filter((part) => part);

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-[70vh] overflow-hidden px-8 md:px-16 lg:px-24 pt-40 pb-16 mb-16"
    >
      {/* ASCII terrain background */}
      <AsciiHeroBg />

      {/* CRT scanline overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-10" style={{ opacity: 0.5 }} />

      {/* Hero title with scramble */}
      <h1
        ref={heroTitleRef}
        className="absolute top-40 left-8 md:left-16 lg:left-24 text-[clamp(4rem,12vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] will-change-transform cursor-default z-20"
        style={{
          fontFamily: "'VT323', 'Inter', sans-serif",
          transformOrigin: "left top",
          transition: "color 0.3s ease-out",
        }}
      >
        {nameParts[0]}
        <br />
        {nameParts.slice(1).join(" ")}
      </h1>

      {/* Tagline — text managed imperatively via useEffect for scramble-on-theme-change */}
      <p
        ref={heroSubtitleRef}
        suppressHydrationWarning
        className="absolute top-[320px] md:top-[360px] lg:top-[400px] left-8 md:left-16 lg:left-24 text-[clamp(1rem,2vw,1.25rem)] text-muted-foreground max-w-[600px] pointer-events-none font-mono z-20"
        style={{
          transformOrigin: "left top",
          transition: "opacity 0.3s ease-out",
        }}
      />

    </section>
  );
}
