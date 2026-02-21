import { getAllWorks, getAllTags } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { BackgroundTitle } from '@/components/background-title'

export const metadata: Metadata = {
  title: 'Works',
  description: 'Creative works including digital art, 3D projects, interactive media, design, and photography.',
}

export default function WorksPage() {
  const allWorks = getAllWorks()
  // Sort works to prioritize UE5 projects (Electric Dream and Ruins) at the top
  const works = allWorks.sort((a, b) => {
    const isAUE5 = a.tags?.includes('UE5') || false
    const isBUE5 = b.tags?.includes('UE5') || false

    if (isAUE5 && !isBUE5) return -1
    if (!isAUE5 && isBUE5) return 1

    // Among UE5 works, sort by date (newest first)
    if (isAUE5 && isBUE5) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    // For non-UE5 works, sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const allTags = getAllTags('works')

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

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Filter by tags:</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Works Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {works.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground">No works available yet.</p>
            </div>
          ) : (
            works.map((work) => (
              <Link
                key={work.slug}
                href={`/works/${work.slug}`}
                className="group block break-inside-avoid mb-6"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-200 hover:shadow-lg">
                  {/* Featured Badge */}
                  {work.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Main Image */}
                  {work.images && work.images.length > 0 && (
                    <div className="relative overflow-hidden">
                      <Image
                        src={work.images[0].src}
                        alt={work.images[0].alt}
                        width={work.images[0].w}
                        height={work.images[0].h}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {work.title}
                    </h3>
                    
                    {work.summary && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {work.summary}
                      </p>
                    )}

                    {/* Tools */}
                    {work.tools && work.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {work.tools.slice(0, 3).map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {work.tools.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{work.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {work.tags?.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {work.tags && work.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{work.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <time dateTime={work.date}>
                        {formatDate(work.date)}
                      </time>
                      <div className="flex items-center gap-2">
                        {work.images && work.images.length > 1 && (
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {work.images.length} images
                          </span>
                        )}
                        {work.videos && work.videos.length > 0 && (
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {work.videos.length} videos
                          </span>
                        )}
                      </div>
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
