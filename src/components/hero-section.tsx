"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  name: string;
  tagline: string;
}

export function HeroSection({ name, tagline }: HeroSectionProps) {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [wasAbsolute, setWasAbsolute] = useState(true);

  useEffect(() => {
    const heroTitle = heroTitleRef.current;
    const heroSubtitle = heroSubtitleRef.current;

    if (!heroTitle || !heroSubtitle) return;

    let ticking = false;

    function updateHeroTitle() {
      if (!heroTitle || !heroSubtitle) return;

      const scrollY = Math.max(window.scrollY || window.pageYOffset, 0);

      // Top area: use absolute positioning
      if (scrollY <= 10) {
        setWasAbsolute(true);

        heroTitle.style.position = 'absolute';
        heroSubtitle.style.position = 'absolute';

        heroTitle.style.top = '';
        heroSubtitle.style.top = '';
        heroTitle.style.left = '';
        heroSubtitle.style.left = '';

        heroTitle.style.transform = 'scale(1) translateX(0)';
        heroSubtitle.style.transform = 'scale(1)';

        heroSubtitle.style.opacity = '1';

        heroTitle.style.zIndex = '100';
        heroSubtitle.style.zIndex = '100';

        heroTitle.style.color = '';

        ticking = false;
        return;
      }

      // Switch from absolute to fixed
      if (scrollY > 10 && wasAbsolute) {
        const titleRect = heroTitle.getBoundingClientRect();
        const subtitleRect = heroSubtitle.getBoundingClientRect();

        heroTitle.style.position = 'fixed';
        heroSubtitle.style.position = 'fixed';

        heroTitle.style.top = `${titleRect.top}px`;
        heroTitle.style.left = `${titleRect.left}px`;

        heroSubtitle.style.top = `${subtitleRect.top}px`;
        heroSubtitle.style.left = `${subtitleRect.left}px`;

        setWasAbsolute(false);
      }

      // Animation logic
      const progress = Math.min(scrollY / 800, 1);

      const titleScale = 1 + (progress * 0.8);
      const subtitleScale = 1 + (progress * 0.4);
      const translateX = -progress * 6;

      heroTitle.style.transform = `scale(${titleScale}) translateX(${translateX}rem)`;
      heroSubtitle.style.transform = `scale(${subtitleScale})`;

      // When animation is complete, lock to exact position matching BackgroundTitle
      if (progress >= 1) {
        heroTitle.style.top = '10rem'; // top-40
        // Calculate responsive left value
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1024) {
          heroTitle.style.left = '6rem'; // lg:left-24
        } else if (viewportWidth >= 768) {
          heroTitle.style.left = '4rem'; // md:left-16
        } else {
          heroTitle.style.left = '2rem'; // left-8
        }
      }

      // Color transition based on theme
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        const lightness = 0.985 - (progress * 0.685); // 0.985 -> 0.3
        heroTitle.style.color = `oklch(${lightness} 0 0)`;
      } else {
        const lightness = 0.145 + (progress * 0.655); // 0.145 -> 0.8
        heroTitle.style.color = `oklch(${lightness} 0 0)`;
      }

      const fadeOpacity = Math.max(1 - (progress * 2), 0);
      heroSubtitle.style.opacity = `${fadeOpacity}`;

      if (scrollY > 100) {
        heroTitle.style.zIndex = '0';
        heroSubtitle.style.zIndex = '0';
      } else {
        heroTitle.style.zIndex = '100';
        heroSubtitle.style.zIndex = '100';
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroTitle);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);

    // Initial correction on load
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

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      window.removeEventListener('load', handleLoad);
    };
  }, [wasAbsolute]);

  // Remove (Chris) from name
  const cleanName = name.replace(/\(.*?\)/g, '').trim();
  const nameParts = cleanName.split(' ').filter(part => part);

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-[500px] overflow-visible px-8 md:px-16 lg:px-24 pt-40 pb-16 mb-16"
    >
      <h1
        ref={heroTitleRef}
        className="absolute top-40 left-8 md:left-16 lg:left-24 text-[clamp(4rem,12vw,8rem)] font-black leading-[0.9] tracking-[-0.03em] pointer-events-none will-change-transform"
        style={{
          transformOrigin: 'left top',
          transition: 'color 0.3s ease-out',
        }}
      >
        {nameParts[0]}<br />
        {nameParts.slice(1).join(' ')}
      </h1>
      <p
        ref={heroSubtitleRef}
        className="absolute top-[320px] md:top-[360px] lg:top-[400px] left-8 md:left-16 lg:left-24 text-[clamp(1rem,2vw,1.25rem)] text-muted-foreground max-w-[600px] pointer-events-none"
        style={{
          transformOrigin: 'left top',
          transition: 'opacity 0.3s ease-out',
        }}
      >
        {tagline}
      </p>
    </section>
  );
}
