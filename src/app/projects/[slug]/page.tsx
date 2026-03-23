import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
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
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {"cd ../projects"}
          </Link>
        </div>

        <div className="mb-12">
          <p className="sys-label mb-3">{"// PROJECT.DETAIL"}</p>
          <div className="space-y-3">
            {getDisplayDate(project) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono sys-label">
                  {formatDate(getDisplayDate(project)!)}
                </span>
              </div>
            )}
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'VT323', sans-serif" }}
            >
              {project.Title}
            </h1>
          </div>
        </div>

        <div className="terminal-divider my-8" data-label="[ CONTENT ]" />

        <div className="max-w-4xl">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent source={project.Detail} />
          </article>
        </div>
      </div>
    </div>
  );
}
