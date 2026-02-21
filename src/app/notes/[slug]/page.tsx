import { getAllNotes, getNoteBySlug } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const notes = await getAllNotes()
  return notes.map((note) => ({
    slug: note.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug)
  
  if (!note) {
    return {
      title: 'Note Not Found',
    }
  }

  return {
    title: note.title,
    description: note.summary || `Technical note: ${note.title}`,
    openGraph: {
      title: note.title,
      description: note.summary || `Technical note: ${note.title}`,
      type: 'article',
      publishedTime: note.date,
      tags: note.tags,
    },
    twitter: {
      card: 'summary',
      title: note.title,
      description: note.summary || `Technical note: ${note.title}`,
    },
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug)

  if (!note) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
          
          {note.summary && (
            <p className="text-xl text-muted-foreground mb-6">
              {note.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={note.date}>
                {formatDate(note.date)}
              </time>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent source={note.content} />
        </article>

        {/* Navigation Footer */}
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
  )
}
