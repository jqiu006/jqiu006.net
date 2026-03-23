import { getAllCMSTechNotes } from '@/lib/cms'
import { Metadata } from 'next'
import { BackgroundTitle } from '@/components/background-title'
import { NotesList } from '@/components/notes-list'
import { TerminalPageHeader } from '@/components/terminal-page-header'

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tech Notes',
  description: 'Technical notes, tutorials, and insights on cybersecurity, networking, and system administration.',
};

export default async function NotesPage() {
  const notes = await getAllCMSTechNotes();

  // Notes with a PublishDate first (newest → oldest), undated ones at the end
  const sorted = [...notes].sort((a, b) => {
    const aDate = a.PublishDate;
    const bDate = b.PublishDate;
    if (aDate && bDate) return new Date(bDate).getTime() - new Date(aDate).getTime();
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return 0;
  });

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <TerminalPageHeader
            sysLabel={"// NOTES.LOG"}
            title="Tech Notes"
            subtitle="Cybersecurity · Networking · Sysadmin"
          />

          <NotesList notes={sorted} />
        </div>
      </div>
    </div>
  );
}
