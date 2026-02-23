import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllCMSProjects, getCMSProjectById, getDisplayDate } from "@/lib/cms";
import { MDXContent } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getAllCMSProjects();
    return projects.map((p) => ({ slug: p.documentId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getCMSProjectById(slug);
  if (!project) return {};
  return {
    title: project.Title,
    openGraph: {
      title: project.Title,
      type: "article",
      ...(getDisplayDate(project) && { publishedTime: getDisplayDate(project)! }),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getCMSProjectById(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="mb-12">
          <div className="space-y-4">
            {getDisplayDate(project) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(getDisplayDate(project)!)}
                </div>
              </div>
            )}

            <h1 className="text-4xl font-bold tracking-tight">{project.Title}</h1>
          </div>
        </div>

        <Separator className="mb-12" />

        <div className="max-w-4xl">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent source={project.Detail} />
          </article>
        </div>
      </div>
    </div>
  );
}
