import Link from "next/link";
import { ArrowRight, Code, Palette, Camera, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { site } from "../../site.config";
import { getAllProjects, getAllArtwork, getAllPhotos } from "@/lib/content";

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
    href: "/art",
    title: "Digital Art",
    description: "Illustrations, 3D renders, and creative works",
    icon: Palette,
  },
  {
    href: "/photo",
    title: "Photography",
    description: "Portrait and landscape photography",
    icon: Camera,
  },
];

export default function HomePage() {
  const projects = getAllProjects().slice(0, 3);
  const artwork = getAllArtwork().slice(0, 2);
  const photos = getAllPhotos().slice(0, 2);

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

      {/* Featured Art & Photography */}
      <section>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Art */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Latest Art</h2>
                <Link
                  href="/art"
                  className="flex items-center text-accent hover:underline"
                >
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {artwork.length === 0 ? (
                  <p className="text-muted-foreground">No artwork available yet.</p>
                ) : (
                  artwork.map((art, index) => (
                    <div key={art.slug}>
                      <Link href={`/art/${art.slug}`}>
                        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                          <CardHeader>
                            <CardTitle className="text-lg">{art.title}</CardTitle>
                            <CardDescription>{art.summary}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Photography */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Latest Photos</h2>
                <Link
                  href="/photo"
                  className="flex items-center text-accent hover:underline"
                >
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {photos.length === 0 ? (
                  <p className="text-muted-foreground">No photos available yet.</p>
                ) : (
                  photos.map((photo, index) => (
                    <div key={photo.slug}>
                      <Link href={`/photo/${photo.slug}`}>
                        <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                          <CardHeader>
                            <CardTitle className="text-lg">{photo.title}</CardTitle>
                            <CardDescription>{photo.summary}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
