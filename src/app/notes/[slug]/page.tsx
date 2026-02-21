import { getAllCMSTechNotes, getCMSTechNoteById, getEntryDate } from '@/lib/cms'
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
    const notes = await getAllCMSTechNotes();
    return notes.map((n) => ({ slug: n.documentId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getCMSTechNoteById(slug);
  if (!note) return { title: 'Note Not Found' };

  return {
    title: note.Title,
    description: `Technical note: ${note.Title}`,
    openGraph: {
      title: note.Title,
      description: `Technical note: ${note.Title}`,
      type: 'article',
      publishedTime: getEntryDate(note),
    },
    twitter: {
      card: 'summary',
      title: note.Title,
      description: `Technical note: ${note.Title}`,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = await getCMSTechNoteById(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{note.Title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={getEntryDate(note)}>
                {formatDate(getEntryDate(note))}
              </time>
            </div>
          </div>
        </header>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent source={note.Note} />
        </article>

        <footer className="mt-16 pt-8 border-t border-border">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all notes
          </Link>
        </footer>
      </div>
    </div>
  );
}
