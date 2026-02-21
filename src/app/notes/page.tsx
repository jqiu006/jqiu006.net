import { getAllCMSTechNotes, getDisplayDate } from '@/lib/cms'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Metadata } from 'next'
import { BackgroundTitle } from '@/components/background-title'

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tech Notes',
  description: 'Technical notes, tutorials, and insights on cybersecurity, networking, and system administration.',
};

export default async function NotesPage() {
  const notes = await getAllCMSTechNotes();

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

          <div className="grid gap-6">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No notes available yet.</p>
              </div>
            ) : (
              notes.map((note) => (
                <Link
                  key={note.documentId}
                  href={`/notes/${note.documentId}`}
                  className="group block p-6 border border-border rounded-lg hover:border-accent/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        {note.Title}
                      </h3>
                      {getDisplayDate(note) && (
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <time dateTime={getDisplayDate(note)!}>
                            {formatDate(getDisplayDate(note)!)}
                          </time>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
