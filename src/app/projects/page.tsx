import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllCMSProjects, getDisplayDate } from "@/lib/cms";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { BackgroundTitle } from "@/components/background-title";
import { TerminalPageHeader } from "@/components/terminal-page-header";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Exploring network security, virtualization, automation, and infrastructure projects',
};

export default async function ProjectsPage() {
  const projects = await getAllCMSProjects();

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <TerminalPageHeader
          sysLabel={"// PROJECT.LOG"}
          title="Projects"
          subtitle="Homelab · Network Security · Creative"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project.documentId} href={`/projects/${project.documentId}`}>
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-accent/60 group">
                <CardHeader>
                  <span className="sys-label mb-1 block">
                    {`PROJ_${index.toString().padStart(3, '0')}`}
                  </span>
                  <CardTitle className="text-lg flex items-start gap-1">
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {">"}
                    </span>
                    <span>{project.Title}</span>
                  </CardTitle>
                  {getDisplayDate(project) && (
                    <CardDescription className="text-sm text-muted-foreground">
                      {formatDate(getDisplayDate(project)!)}
                    </CardDescription>
                  )}
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
