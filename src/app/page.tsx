import Link from "next/link";
import { ArrowRight, Code, Palette, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { site } from "../../site.config";
import { getAllProjects, getAllWorks } from "@/lib/content";
import { HeroSection } from "@/components/hero-section";

const quickLinks = [
  {
    href: "/projects",
    title: "IT Projects",
    description: "Homelab setups, network security, and automation",
    icon: Code,
  },
  {
    href: "/notes",
    title: "Tech Notes",
    description: "Security research, tutorials, and learning notes",
    icon: FileText,
  },
  {
    href: "/works",
    title: "Creative Works",
    description: "Digital art, UE5 projects, and interactive media",
    icon: Palette,
  },
];

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3);
  const works = getAllWorks().slice(0, 4);

  return (
    <div className="relative">
      {/* Hero Section with Scroll Effect */}
      <HeroSection name={site.name} tagline={site.tagline} />

      <div className="container mx-auto px-4 py-12 relative z-10 bg-background">

      {/* Quick Links */}
      <section className="mb-16 animate-fade-in-up">
        <div>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div key={link.href} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link href={link.href}>
                    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border">
                      <CardHeader>
                        <IconComponent className="h-8 w-8 text-accent mb-2 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                        <CardTitle className="text-lg font-semibold">{link.title}</CardTitle>
                        <CardDescription className="text-sm">{link.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mb-16">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <Link
              href="/projects"
              className="flex items-center text-accent hover:opacity-80 transition-opacity text-sm font-medium"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.slug} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <Link href={`/projects/${project.slug}`}>
                  <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">{project.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{project.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        )) || []}
                        {project.tech && project.tech.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tech.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="mb-16">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Works</h2>
            <Link
              href="/works"
              className="flex items-center text-accent hover:opacity-80 transition-opacity text-sm font-medium"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {works.length === 0 ? (
              <p className="text-muted-foreground col-span-2 text-sm">No works available yet.</p>
            ) : (
              works.map((work, index) => (
                <div key={work.slug} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link href={`/works/${work.slug}`}>
                    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">{work.title}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">{work.summary}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {work.featured && (
                            <Badge variant="default" className="text-xs bg-accent text-accent-foreground">Featured</Badge>
                          )}
                          {work.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          )) || []}
                          {work.tags && work.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{work.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
