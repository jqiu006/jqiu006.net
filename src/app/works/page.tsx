import { getAllCMSWorks, getCoverUrl, getDisplayDate } from '@/lib/cms'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Metadata } from 'next'
import { BackgroundTitle } from '@/components/background-title'
import { TerminalPageHeader } from '@/components/terminal-page-header'

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Works',
  description: 'Creative works including digital art, 3D projects, interactive media, design, and photography.',
};

export default async function WorksPage() {
  const works = await getAllCMSWorks();

  const sorted = [...works].sort((a, b) => {
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
        <div className="max-w-6xl mx-auto">
          <TerminalPageHeader
            sysLabel={"// CREATIVE.OUTPUT"}
            title="Works"
            subtitle="Digital Art · 3D · Interactive · Photography"
          />

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {works.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground">No works available yet.</p>
              </div>
            ) : (
              sorted.map((work) => (
                <Link
                  key={work.documentId}
                  href={`/works/${work.documentId}`}
                  className="group block break-inside-avoid mb-6"
                >
                  <div className="bg-card border border-border overflow-hidden hover:border-accent/60 transition-all duration-200 hover:shadow-lg">
                    {/* Cover image (only if it's an actual image, not a video) */}
                    {work.Cover && work.Cover.mime?.startsWith('image/') && (
                      <div className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCoverUrl(work.Cover)}
                          alt={work.Title}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover overlay with terminal-style title */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                          <p className="sys-label mb-1">
                            {getDisplayDate(work)
                              ? formatDate(getDisplayDate(work)!)
                              : ""}
                          </p>
                          <p
                            className="text-lg font-bold text-foreground leading-tight"
                            style={{ fontFamily: "'VT323', monospace" }}
                          >
                            {work.Title}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                        {work.Title}
                      </h3>
                      {getDisplayDate(work) && (
                        <div className="text-xs text-muted-foreground">
                          <time dateTime={getDisplayDate(work)!}>
                            {formatDate(getDisplayDate(work)!)}
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
