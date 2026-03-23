"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { site } from "../../site.config";
import logoSrc from "../app/icon.png";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={site.name}>
          <Image
            src={logoSrc}
            alt={site.name}
            width={36}
            height={36}
            className="dark:invert"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium font-mono tracking-wide transition-colors hover:text-accent ${
                pathname === item.href
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              {pathname === item.href ? "> " : ""}{item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
