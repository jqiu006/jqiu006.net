import Link from "next/link";
import { ArrowRight, Code, Palette, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { site } from "../../site.config";
import { getAllProjects, getAllWorks } from "@/lib/content";

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
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {site.name}
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            {site.tagline}
          </p>
          {site.enableTypewriter && (
            <div className="mb-8">
              <p className="text-lg text-muted-foreground">
                Building secure networks, automating infrastructure, and creating digital art
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-16">
        <div>
          <h2 className="mb-8 text-2xl font-semibold text-center">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <div key={link.href}>
                  <Link href={link.href}>
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <IconComponent className="h-8 w-8 text-accent mb-2" />
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
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
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Link
              href="/projects"
              className="flex items-center text-accent hover:underline"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.slug}>
                <Link href={`/projects/${project.slug}`}>
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        )) || []}
                        {project.tech && project.tech.length > 3 && (
                          <Badge variant="outline">
                            +{project.tech.length - 3} more
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
      <section>
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Featured Works</h2>
            <Link
              href="/works"
              className="flex items-center text-accent hover:underline"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {works.length === 0 ? (
              <p className="text-muted-foreground col-span-2">No works available yet.</p>
            ) : (
              works.map((work) => (
                <div key={work.slug}>
                  <Link href={`/works/${work.slug}`}>
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle className="text-lg">{work.title}</CardTitle>
                        <CardDescription>{work.summary}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {work.featured && (
                            <Badge variant="default">Featured</Badge>
                          )}
                          {work.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          )) || []}
                          {work.tags && work.tags.length > 3 && (
                            <Badge variant="outline">
                              +{work.tags.length - 3} more
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
  );
}
