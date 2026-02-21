# Jinhui (Chris) Qiu - Personal Portfolio Website

A modern, minimal personal portfolio website built with Next.js 14+, showcasing IT/Homelab projects, security research, and creative works including digital art and photography.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Content Management**: MDX-based content with gray-matter frontmatter parsing
- **Dark/Light Mode**: System-aware theme switching with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Static generation, image optimization, and SEO-friendly
- **Component Library**: shadcn/ui components for consistent design
- **Type Safety**: Full TypeScript implementation
- **Content Types**: Projects, Notes, Art, Photography with structured schemas

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Content**: MDX with gray-matter
- **Icons**: Lucide React
- **Animations**: CSS transitions and transforms
- **Theme**: next-themes
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact form
│   │   ├── projects/          # Projects listing and detail pages
│   │   │   └── [slug]/        # Dynamic project pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles and CSS variables
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navigation.tsx    # Main navigation
│   │   ├── theme-provider.tsx # Theme context provider
│   │   └── theme-toggle.tsx  # Dark/light mode toggle
│   └── lib/                  # Utilities and helpers
│       ├── content.ts        # Content management functions
│       ├── mdx.tsx          # MDX rendering components
│       └── utils.ts         # General utilities
├── content/                  # MDX content files
│   ├── projects/            # IT/Homelab project write-ups
│   ├── notes/              # Tech notes and blog posts
│   ├── art/                # Digital art and creative works
│   └── photo/              # Photography collections
├── public/                 # Static assets
│   └── resume.pdf         # Downloadable resume
├── site.config.ts         # Site configuration and metadata
└── tailwind.config.ts     # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jqiu006.com
   ```

2. **Install dependencies**
   ```bash
   nvm ls
   nvm install --lts
   nvm use --lts
   node -v
   npm -v
   corepack enable       # Node 16+ 建议执行一次
   yarn install
   # or
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Adding New Projects

1. Create a new `.mdx` file in `content/projects/`
2. Add frontmatter with required fields:

```yaml
---
title: "Your Project Title"
date: "2024-01-15"
year: 2024
summary: "Brief project description"
tags: ["Docker", "Proxmox", "Security"]
cover: "/images/projects/your-project.jpg"
repo: "https://github.com/username/repo" # optional
tech: ["Technology", "Stack", "Used"]
status: "completed" # or "ongoing"
---

# Your project content in Markdown/MDX format
```

### Adding Other Content Types

- **Notes**: Add `.mdx` files to `content/notes/`
- **Art**: Add `.mdx` files to `content/art/`
- **Photography**: Add `.mdx` files to `content/photo/`

Each content type has its own schema defined in `src/lib/content.ts`.

## ⚙️ Configuration

### Site Configuration

Edit `site.config.ts` to customize:

- Site name and tagline
- Accent color
- Social media links
- Feature toggles (typewriter effect, dynamic grid)
- Analytics settings
- Currently learning items

### Theme Customization

The site uses CSS custom properties for theming. Edit `src/app/globals.css` to customize:

- Color palette
- Typography
- Spacing
- Border radius
- Animations

### Tailwind Configuration

Customize the design system in `tailwind.config.ts`:

- Extend color palette
- Add custom animations
- Configure typography plugin
- Set up custom utilities

## 🎨 Design System

### Colors

- **Accent**: Bright cyan-green (`#00E5A8`) for highlights and interactive elements
- **Neutral**: Black, white, and gray scale for content
- **Semantic**: Success, error, and warning colors for feedback

### Typography

- **Headings**: Bold, tracking-tight for hierarchy
- **Body**: Readable line height and spacing
- **Code**: Monospace with syntax highlighting

### Components

Built with shadcn/ui for consistency:

- Cards for content containers
- Buttons with multiple variants
- Form inputs with proper labeling
- Badges for tags and status indicators
- Navigation with active states

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid and Flexbox for layouts
- **Touch-friendly**: Appropriate touch targets and spacing

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Code formatting (configure as needed)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set environment variables** (if needed)
4. **Deploy**: Automatic deployments on git push

### Other Platforms

The site is a standard Next.js application and can be deployed to:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform
- Self-hosted with PM2/Docker

## 🔍 SEO & Performance

### Built-in Optimizations

- **Static Generation**: Pages pre-rendered at build time
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Font Optimization**: Self-hosted fonts with `next/font`
- **Metadata**: Comprehensive meta tags and Open Graph
- **Sitemap**: Auto-generated sitemap.xml
- **Robots.txt**: Search engine directives

### Performance Targets

- **Lighthouse Performance**: 95+ (desktop), 90+ (mobile)
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FID < 100ms
- **Bundle Size**: Optimized with tree shaking and code splitting

## 🎯 Content Strategy

### Project Documentation

Each project should include:

1. **Background & Objectives**: Problem definition and goals
2. **Architecture**: System design and topology
3. **Implementation**: Step-by-step process
4. **Challenges & Solutions**: Problems encountered and fixes
5. **Results & Metrics**: Outcomes and performance data
6. **Lessons Learned**: Key takeaways and insights
7. **Future Enhancements**: Planned improvements

### Content Guidelines

- **Technical Accuracy**: Verify all technical details
- **Clear Structure**: Use headings and sections consistently
- **Visual Elements**: Include diagrams, screenshots, and code blocks
- **Accessibility**: Provide alt text for images
- **SEO**: Use descriptive titles and meta descriptions

## 🤝 Contributing

This is a personal portfolio, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: jqiu006@gmail.com
- **GitHub**: [jqiu006](https://github.com/jqiu006)
- **LinkedIn**: [jinhui-qiu](https://linkedin.com/in/jinhui-qiu)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
