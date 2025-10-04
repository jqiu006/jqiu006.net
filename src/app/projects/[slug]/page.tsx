import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, getAllProjects } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      publishedTime: project.date,
      images: project.cover ? [{ url: project.cover }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          {project.cover && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={project.cover}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(project.date)}
              </div>
              {project.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {project.readingTime}
                </div>
              )}
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.summary}</p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {project.repo && (
              <div>
                <Link href={project.repo} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Repository
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Content */}
        <div className="max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}
