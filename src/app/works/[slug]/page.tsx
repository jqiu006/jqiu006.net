import { getAllWorks, getWorkBySlug } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const works = getAllWorks()
  return works.map((work) => ({
    slug: work.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug)
  
  if (!work) {
    return {
      title: 'Work Not Found',
    }
  }

  const firstImage = work.images?.[0]

  return {
    title: work.title,
    description: work.summary || `Creative work: ${work.title}`,
    openGraph: {
      title: work.title,
      description: work.summary || `Creative work: ${work.title}`,
      type: 'article',
      publishedTime: work.date,
      images: firstImage ? [
        {
          url: firstImage.src,
          width: firstImage.w,
          height: firstImage.h,
          alt: firstImage.alt,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: work.title,
      description: work.summary || `Creative work: ${work.title}`,
      images: firstImage ? [firstImage.src] : undefined,
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug)

  if (!work) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Works
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{work.title}</h1>
            {work.featured && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </div>
          
          {work.summary && (
            <p className="text-xl text-muted-foreground mb-6">
              {work.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={work.date}>
                {formatDate(work.date)}
              </time>
            </div>

            <div className="text-sm">
              <span className="capitalize">{work.category.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Tools */}
          {work.tools && work.tools.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tools Used:</h3>
              <div className="flex flex-wrap gap-2">
                {work.tools.map((tool) => (
                  <Badge key={tool} variant="secondary">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Videos Section */}
        {work.videos && work.videos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Videos</h2>
            <div className="grid gap-6">
              {work.videos.map((video, index) => (
                <div key={index} className="relative group">
                  <div className="relative overflow-hidden rounded-lg bg-muted aspect-video">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={work.images?.[0]?.src}
                    >
                      <source 
                        src={video.src} 
                        type={
                          video.type === 'avi' ? 'video/x-msvideo' :
                          video.type === 'mkv' ? 'video/x-matroska' :
                          `video/${video.type}`
                        } 
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  {video.alt && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {video.alt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {work.images && work.images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
            <div className="grid gap-6">
              {work.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.w}
                      height={image.h}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority={index === 0}
                    />
                  </div>
                  {image.alt && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {image.alt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        {work.content && (
          <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <MDXContent source={work.content} />
          </article>
        )}

        {/* EXIF Data for Photography */}
        {work.meta?.exif && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Technical Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6 bg-secondary/50 rounded-lg">
              {work.meta.exif.camera && (
                <div>
                  <div className="text-xs text-muted-foreground">Camera</div>
                  <div className="font-medium">{work.meta.exif.camera}</div>
                </div>
              )}
              {work.meta.exif.lens && (
                <div>
                  <div className="text-xs text-muted-foreground">Lens</div>
                  <div className="font-medium">{work.meta.exif.lens}</div>
                </div>
              )}
              {work.meta.exif.aperture && (
                <div>
                  <div className="text-xs text-muted-foreground">Aperture</div>
                  <div className="font-medium">{work.meta.exif.aperture}</div>
                </div>
              )}
              {work.meta.exif.shutter && (
                <div>
                  <div className="text-xs text-muted-foreground">Shutter</div>
                  <div className="font-medium">{work.meta.exif.shutter}</div>
                </div>
              )}
              {work.meta.exif.iso && (
                <div>
                  <div className="text-xs text-muted-foreground">ISO</div>
                  <div className="font-medium">{work.meta.exif.iso}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <footer className="pt-8 border-t border-border">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all works
          </Link>
        </footer>
      </div>
    </div>
  )
}
