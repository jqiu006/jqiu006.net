import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllProjects } from "@/lib/content";
import { Metadata } from "next";
import { BackgroundTitle } from "@/components/background-title";

export const metadata: Metadata = {
  title: 'IT Projects & Homelab',
  description: 'Exploring network security, virtualization, automation, and infrastructure projects',
}

export default async function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">IT Projects & Homelab</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Exploring network security, virtualization, automation, and infrastructure projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`}>
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              {project.cover && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.tech?.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    )) || []}
                    {project.tech && project.tech.length > 4 && (
                      <Badge variant="outline">
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    )) || []}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.year} • {project.readingTime}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
      </div>
    </div>
  );
}
