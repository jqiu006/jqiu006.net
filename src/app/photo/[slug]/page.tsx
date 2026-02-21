import { getAllPhotos, getPhotoBySlug } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Camera, Aperture, Timer, Zap } from 'lucide-react'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const photos = await getAllPhotos()
  return photos.map((photo) => ({
    slug: photo.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await getPhotoBySlug(params.slug)
  
  if (!photo) {
    return {
      title: 'Photo Not Found',
    }
  }

  const firstImage = photo.images?.[0]

  return {
    title: photo.title,
    description: photo.summary || `Photography: ${photo.title}`,
    openGraph: {
      title: photo.title,
      description: photo.summary || `Photography: ${photo.title}`,
      type: 'article',
      publishedTime: photo.date,
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
      title: photo.title,
      description: photo.summary || `Photography: ${photo.title}`,
      images: firstImage ? [firstImage.src] : undefined,
    },
  }
}

export default async function PhotoPage({ params }: Props) {
  const photo = await getPhotoBySlug(params.slug)

  if (!photo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/photo"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Photography
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{photo.title}</h1>
          
          {photo.summary && (
            <p className="text-xl text-muted-foreground mb-6">
              {photo.summary}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={photo.date}>
              {formatDate(photo.date)}
            </time>
          </div>
        </header>

        {/* Photo Gallery */}
        {photo.images && photo.images.length > 0 && (
          <div className="mb-12">
            <div className="grid gap-8">
              {photo.images.map((image, index) => (
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
                  
                  {/* Image Caption and EXIF */}
                  <div className="mt-4">
                    {image.alt && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {image.alt}
                      </p>
                    )}
                    
                    {/* EXIF Data */}
                    {photo.meta?.exif && index === 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-lg text-sm">
                        {photo.meta.exif.camera && (
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Camera</div>
                              <div className="font-medium">{photo.meta.exif.camera}</div>
                            </div>
                          </div>
                        )}
                        
                        {photo.meta.exif.lens && (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 text-muted-foreground">📷</div>
                            <div>
                              <div className="text-xs text-muted-foreground">Lens</div>
                              <div className="font-medium">{photo.meta.exif.lens}</div>
                            </div>
                          </div>
                        )}
                        
                        {photo.meta.exif.aperture && (
                          <div className="flex items-center gap-2">
                            <Aperture className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Aperture</div>
                              <div className="font-medium">{photo.meta.exif.aperture}</div>
                            </div>
                          </div>
                        )}
                        
                        {photo.meta.exif.shutter && (
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Shutter</div>
                              <div className="font-medium">{photo.meta.exif.shutter}</div>
                            </div>
                          </div>
                        )}
                        
                        {photo.meta.exif.iso && (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">ISO</div>
                              <div className="font-medium">{photo.meta.exif.iso}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        {photo.content && (
          <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <MDXContent source={photo.content} />
          </article>
        )}

        {/* Navigation Footer */}
        <footer className="pt-8 border-t border-border">
          <Link
            href="/photo"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to photography
          </Link>
        </footer>
      </div>
    </div>
  )
}
