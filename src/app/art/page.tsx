import { getAllArtwork } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Art & Design',
  description: 'Digital artwork, illustrations, and design projects showcasing creative exploration and technical skills.',
}

export default async function ArtPage() {
  const artwork = await getAllArtwork()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Digital Art & Design</h1>
          <p className="text-xl text-muted-foreground">
            Digital artwork, illustrations, and design projects showcasing creative exploration and technical skills.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {artwork.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground">No artwork available yet.</p>
            </div>
          ) : (
            artwork.map((art) => (
              <Link
                key={art.slug}
                href={`/art/${art.slug}`}
                className="group block break-inside-avoid mb-6"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-200 hover:shadow-lg">
                  {/* Main Image */}
                  {art.images && art.images.length > 0 && (
                    <div className="relative overflow-hidden">
                      <Image
                        src={art.images[0].src}
                        alt={art.images[0].alt}
                        width={art.images[0].w}
                        height={art.images[0].h}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {art.title}
                    </h3>
                    
                    {art.summary && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {art.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <time dateTime={art.date}>
                        {formatDate(art.date)}
                      </time>
                      {art.images && art.images.length > 1 && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {art.images.length} images
                        </span>
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
  )
}
