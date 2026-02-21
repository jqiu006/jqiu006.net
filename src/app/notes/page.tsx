import { getAllNotes } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Metadata } from 'next'
import { BackgroundTitle } from '@/components/background-title'

export const metadata: Metadata = {
  title: 'Tech Notes',
  description: 'Technical notes, tutorials, and insights on cybersecurity, networking, and system administration.',
}

export default async function NotesPage() {
  const notes = await getAllNotes()

  // Get unique tags for filtering
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  ).sort()

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Tech Notes</h1>
          <p className="text-xl text-muted-foreground">
            Technical notes, tutorials, and insights on cybersecurity, networking, and system administration.
          </p>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Filter by topic:</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid gap-6">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No notes available yet.</p>
            </div>
          ) : (
            notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="group block p-6 border border-border rounded-lg hover:border-accent/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                      {note.title}
                    </h3>
                    {note.summary && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {note.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <time dateTime={note.date}>
                        {formatDate(note.date)}
                      </time>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
