import { getAllCMSTechNotes, getCMSTechNoteById, getDisplayDate } from '@/lib/cms'
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
      ...(getDisplayDate(note) && { publishedTime: getDisplayDate(note)! }),
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
          className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          {"cd ../notes"}
        </Link>

        <header className="mb-12">
          <p className="sys-label mb-3">{"// NOTE.DETAIL"}</p>

          {getDisplayDate(note) && (
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono sys-label">
                <time dateTime={getDisplayDate(note)!}>
                  {formatDate(getDisplayDate(note)!)}
                </time>
              </span>
            </div>
          )}

          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'VT323', sans-serif" }}
          >
            {note.Title}
          </h1>
        </header>

        <div className="terminal-divider my-8" data-label="[ CONTENT ]" />

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent source={note.Note} />
        </article>

        <footer className="mt-16 pt-8 border-t border-border">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {"cd ../notes"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
