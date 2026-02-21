# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Jinhui (Chris) Qiu, built with Next.js 14+ using the App Router. The site showcases IT/Homelab projects, technical notes, and creative works (digital art and photography) through an MDX-based content management system.

## Development Commands

```bash
# Development (with Turbopack)
npm run dev          # Start dev server at http://localhost:3000
yarn dev

# Production
npm run build        # Build for production (with Turbopack)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check (no npm script defined)
```

**Note**: This project uses Turbopack (`--turbopack` flag) for faster builds and development.

## Architecture

### Content Management System

The site uses a file-based CMS with MDX files stored in `/content/` directories. Content is parsed at build time using `gray-matter` for frontmatter and rendered with `next-mdx-remote`.

**Key Content Library**: `src/lib/content.ts`
- Exports functions like `getAllProjects()`, `getProjectBySlug()`, `getAllNotes()`, `getAllWorks()`, etc.
- Each content type has a TypeScript interface defining its schema (`Project`, `Note`, `Work`, `Artwork`, `Photo`)
- Content is sorted by date (newest first) and includes reading time calculations
- Legacy interfaces (`Artwork`, `Photo`) exist for backward compatibility with the new unified `Work` interface

**Content Types**:
- **Projects** (`content/projects/`): IT/Homelab technical projects with tags, tech stack, status, cover images
- **Notes** (`content/notes/`): Tech notes and blog posts
- **Works** (`content/works/`): Unified creative content (digital art, 3D, photography, web-dev) with category field
- **Art** (`content/art/`): Legacy digital art content (use `works/` for new content)
- **Photo** (`content/photo/`): Legacy photography content (use `works/` for new content)

### MDX Rendering

**MDX Configuration**: `src/lib/mdx.tsx`
- Uses `next-mdx-remote/rsc` for server-side rendering
- Plugins: `remark-gfm` (GitHub Flavored Markdown), `rehype-slug`, `rehype-autolink-headings`
- Renders with Tailwind typography plugin (`prose prose-neutral dark:prose-invert`)
- Includes `generateTableOfContents()` utility for extracting headings

### Routing Structure

App Router structure (`src/app/`):
- `/` - Home page with intro and featured content
- `/about` - About page
- `/contact` - Contact form
- `/projects` - Projects listing
- `/projects/[slug]` - Individual project detail pages
- `/notes` - Notes listing
- `/notes/[slug]` - Individual note detail pages
- `/works` - Unified creative works listing
- `/works/[slug]` - Individual work detail pages
- `/art/[slug]` - Legacy art pages (redirects or fallback)
- `/photo/[slug]` - Legacy photo pages (redirects or fallback)

**API Routes**:
- `/api/content/route.ts` - Content API endpoint (if needed for dynamic features)

### Theming

**Theme System**:
- Uses `next-themes` for dark/light mode switching
- Default theme: dark with system detection enabled
- Theme provider wraps entire app in `src/app/layout.tsx`
- CSS variables defined in `src/app/globals.css` using HSL color space
- Accent color configurable in `site.config.ts` (default: `#00E5A8` bright cyan-green)

**Theme Components**:
- `src/components/theme-provider.tsx` - Context provider
- `src/components/theme-toggle.tsx` - Dark/light mode toggle button
- Tailwind configured with `darkMode: "class"`

### Component Architecture

**UI Components** (`src/components/ui/`):
- Built with shadcn/ui conventions
- Uses Radix UI primitives and class-variance-authority
- Key components: Button, Card, Badge, Input, Textarea, Label, Separator
- Styling via Tailwind with CSS variables from globals.css

**Layout Components**:
- `src/components/navigation.tsx` - Main navigation with active state detection
- `src/app/layout.tsx` - Root layout with metadata, fonts (Inter), theme provider

### Configuration Files

**Site Configuration** (`site.config.ts`):
- Centralized site metadata: name, tagline, description, URL, accent color
- Feature toggles: `enableTypewriter`, `enableDynamicGrid`, `galleryLayout`
- Social links (GitHub, LinkedIn, email)
- Analytics settings (Vercel, Plausible)
- `currentlyLearning` array for skills section

**Path Aliases**:
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## Content Frontmatter Schemas

### Project Frontmatter
```yaml
---
title: "Project Title"
date: "2024-01-15"
year: 2024
summary: "Brief description"
tags: ["Docker", "Proxmox", "Security"]
cover: "/images/projects/project-name.jpg"
repo: "https://github.com/username/repo"  # optional
tech: ["Technology", "Stack", "Used"]
status: "completed"  # or "ongoing"
---
```

### Note Frontmatter
```yaml
---
title: "Note Title"
date: "2024-01-15"
tags: ["Tag1", "Tag2"]
summary: "Optional brief description"  # optional
---
```

### Work Frontmatter (Unified Creative Content)
```yaml
---
title: "Work Title"
date: "2024-01-15"
summary: "Brief description"
tags: ["Tag1", "Tag2"]
images:
  - src: "/images/works/image1.jpg"
    alt: "Image description"
    w: 1920
    h: 1080
videos:  # optional
  - src: "/videos/demo.mp4"
    alt: "Video description"
    type: "mp4"
tools: ["Photoshop", "Blender"]  # optional
category: "digital-art"  # or "3d", "interactive", "design", "photography", "web-dev"
featured: true  # optional, for homepage
meta:  # optional, mainly for photography
  exif:
    camera: "Canon EOS R5"
    lens: "RF 24-70mm f/2.8"
    iso: 400
    shutter: "1/125"
    aperture: "f/2.8"
---
```

## Styling Conventions

- **Utility-First**: Tailwind CSS with custom design tokens
- **Typography**: `@tailwindcss/typography` plugin for MDX prose rendering
- **Animations**: Custom keyframes in `tailwind.config.ts` (typewriter, fade-in, blink)
- **Responsive**: Mobile-first with breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- **CSS Variables**: HSL-based color system for theme switching (see `src/app/globals.css`)

## Key Technical Details

- **TypeScript**: Strict mode enabled
- **React Version**: 19.1.0 (latest)
- **Next.js Version**: 15.5.2 with App Router
- **Node.js**: Requires 18+ (use nvm for version management)
- **Package Manager**: Supports npm, yarn, or pnpm
- **Deployment**: Optimized for Vercel with `vercel.json` configuration
- **Images**: Use Next.js Image component for optimization (stored in `/public/`)
- **Static Assets**: Place in `/public/` directory (e.g., `/public/resume.pdf`)

## Development Patterns

### Adding New Content

1. Create `.mdx` file in appropriate `content/` subdirectory
2. Add required frontmatter (see schemas above)
3. Write content using Markdown/MDX syntax
4. Images should be placed in `/public/images/{content-type}/`
5. Content will be automatically picked up by `getAllProjects()` etc. functions
6. Dynamic routes will generate pages based on slug

### Modifying Content Schema

1. Update interface in `src/lib/content.ts` (e.g., `Project`, `Note`, `Work`)
2. Update corresponding parse/get functions if needed
3. Update TypeScript types in page components
4. Update frontmatter documentation in this file

### Adding New UI Components

1. Follow shadcn/ui conventions in `src/components/ui/`
2. Use class-variance-authority for variant styling
3. Use Radix UI primitives when applicable
4. Import and compose in feature components

## Important Notes

- **Content Migration**: The site is transitioning from separate `art/` and `photo/` directories to a unified `works/` directory. Legacy content still exists for backward compatibility.
- **Turbopack**: Both dev and build commands use `--turbopack` flag for faster compilation.
- **Reading Time**: Automatically calculated for all content types using `reading-time` package.
- **SEO**: Metadata configured in `src/app/layout.tsx` with OpenGraph and Twitter card support.
- **Analytics**: Configurable in `site.config.ts` (Vercel Analytics enabled by default).
