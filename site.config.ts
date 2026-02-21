export const site = {
  name: "Jinhui (Chris) Qiu",
  tagline: "IT Support & Security‑Minded Technologist",
  description: "Personal portfolio showcasing IT/Homelab projects, security research, and creative works including digital art and photography.",
  url: "https://jqiu006.com",
  accent: "#00E5A8", // Bright cyan-green accent color
  enableTypewriter: true,
  enableDynamicGrid: false,
  galleryLayout: "masonry" as const, // or "grid"
  social: {
    github: "https://github.com/jqiu006",
    linkedin: "https://linkedin.com/in/jinhui-qiu",
    email: "jqiu006@gmail.com",
  },
  analytics: { 
    vercel: true, 
    plausible: false 
  },
  currentlyLearning: [
    "Advanced Proxmox Clustering",
    "Kubernetes Security",
    "Zero Trust Architecture",
    "Unreal Engine 5 Blueprints"
  ]
} as const;

export type SiteConfig = typeof site;
