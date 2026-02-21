import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllCMSProjects, getEntryDate } from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { BackgroundTitle } from "@/components/background-title";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'IT Projects & Homelab',
  description: 'Exploring network security, virtualization, automation, and infrastructure projects',
};

export default async function ProjectsPage() {
  const projects = await getAllCMSProjects();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.documentId} href={`/projects/${project.documentId}`}>
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg">{project.Title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {formatDate(getEntryDate(project))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.Detail.replace(/```[\s\S]*?```/g, '').replace(/[#*`>\[\]!]/g, '').trim().slice(0, 200)}
                  </p>
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
