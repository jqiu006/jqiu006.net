import { getAllCMSWorks, getCMSWorkById, getCoverUrl, getDisplayDate } from '@/lib/cms'
import { MDXContent } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const works = await getAllCMSWorks();
    return works.map((w) => ({ slug: w.documentId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await getCMSWorkById(slug);
  if (!work) return { title: 'Work Not Found' };

  const coverUrl = work.Cover?.mime?.startsWith('image/') ? getCoverUrl(work.Cover) : undefined;

  return {
    title: work.Title,
    description: `Creative work: ${work.Title}`,
    openGraph: {
      title: work.Title,
      description: `Creative work: ${work.Title}`,
      type: 'article',
      ...(getDisplayDate(work) && { publishedTime: getDisplayDate(work)! }),
      images: coverUrl ? [{ url: coverUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: work.Title,
      description: `Creative work: ${work.Title}`,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = await getCMSWorkById(slug);

  if (!work) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          {"cd ../works"}
        </Link>

        <header className="mb-12">
          <p className="sys-label mb-3">{"// WORK.DETAIL"}</p>

          {getDisplayDate(work) && (
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono sys-label">
                <time dateTime={getDisplayDate(work)!}>
                  {formatDate(getDisplayDate(work)!)}
                </time>
              </span>
            </div>
          )}

          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'VT323', sans-serif" }}
          >
            {work.Title}
          </h1>
        </header>

        <div className="terminal-divider my-8" data-label="[ CONTENT ]" />

        {/* Detail content — Strapi embeds images/videos as markdown links with absolute URLs */}
        <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          <MDXContent source={work.Detail} />
        </article>

        <footer className="pt-8 border-t border-border">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {"cd ../works"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
