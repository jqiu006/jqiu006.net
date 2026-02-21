import { getAllPhotos } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography',
  description: 'Photography portfolio showcasing landscapes, portraits, and creative visual storytelling.',
}

export default async function PhotoPage() {
  const photos = await getAllPhotos()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Photography</h1>
          <p className="text-xl text-muted-foreground">
            Photography portfolio showcasing landscapes, portraits, and creative visual storytelling.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground">No photos available yet.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <Link
                key={photo.slug}
                href={`/photo/${photo.slug}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-200 hover:shadow-lg">
                  {/* Main Image */}
                  {photo.images && photo.images.length > 0 && (
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <Image
                        src={photo.images[0].src}
                        alt={photo.images[0].alt}
                        width={photo.images[0].w}
                        height={photo.images[0].h}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {photo.title}
                    </h3>
                    
                    {photo.summary && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {photo.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <time dateTime={photo.date}>
                        {formatDate(photo.date)}
                      </time>
                      {photo.images && photo.images.length > 1 && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {photo.images.length} photos
                        </span>
                      )}
                    </div>

                    {/* EXIF Preview */}
                    {photo.meta?.exif && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {photo.meta.exif.camera && (
                            <span>{photo.meta.exif.camera}</span>
                          )}
                          {photo.meta.exif.lens && (
                            <span>{photo.meta.exif.lens}</span>
                          )}
                        </div>
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
  )
}
