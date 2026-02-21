import { getAllCMSWorks, getCMSWorkById, getCoverUrl, getEntryDate } from '@/lib/cms'
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
      publishedTime: getEntryDate(work),
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
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Works
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{work.Title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={getEntryDate(work)}>
                {formatDate(getEntryDate(work))}
              </time>
            </div>
          </div>
        </header>

        {/* Detail content — Strapi embeds images/videos as markdown links with absolute URLs */}
        <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          <MDXContent source={work.Detail} />
        </article>

        <footer className="pt-8 border-t border-border">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all works
          </Link>
        </footer>
      </div>
    </div>
  );
}
