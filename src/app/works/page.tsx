import { getAllCMSWorks, getCoverUrl, getEntryDate } from '@/lib/cms'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Metadata } from 'next'
import { BackgroundTitle } from '@/components/background-title'

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Works',
  description: 'Creative works including digital art, 3D projects, interactive media, design, and photography.',
};

export default async function WorksPage() {
  const works = await getAllCMSWorks();

  return (
    <div className="relative">
      <BackgroundTitle />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Works</h1>
            <p className="text-xl text-muted-foreground">
              Creative works including digital art, 3D projects, interactive media, design, and photography.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {works.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground">No works available yet.</p>
              </div>
            ) : (
              works.map((work) => (
                <Link
                  key={work.documentId}
                  href={`/works/${work.documentId}`}
                  className="group block break-inside-avoid mb-6"
                >
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-200 hover:shadow-lg">
                    {/* Cover image (only if it's an actual image, not a video) */}
                    {work.Cover && work.Cover.mime?.startsWith('image/') && (
                      <div className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCoverUrl(work.Cover)}
                          alt={work.Title}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                        {work.Title}
                      </h3>
                      <div className="text-xs text-muted-foreground">
                        <time dateTime={getEntryDate(work)}>
                          {formatDate(getEntryDate(work))}
                        </time>
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
  );
}
