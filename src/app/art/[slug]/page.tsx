import { getAllArtwork, getArtworkBySlug } from '@/lib/content'
import { MDXContent } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar } from 'lucide-react'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const artwork = await getAllArtwork()
  return artwork.map((art) => ({
    slug: art.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const art = await getArtworkBySlug(params.slug)
  
  if (!art) {
    return {
      title: 'Artwork Not Found',
    }
  }

  const firstImage = art.images?.[0]

  return {
    title: art.title,
    description: art.summary || `Digital artwork: ${art.title}`,
    openGraph: {
      title: art.title,
      description: art.summary || `Digital artwork: ${art.title}`,
      type: 'article',
      publishedTime: art.date,
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
      title: art.title,
      description: art.summary || `Digital artwork: ${art.title}`,
      images: firstImage ? [firstImage.src] : undefined,
    },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const art = await getArtworkBySlug(params.slug)

  if (!art) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/art"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{art.title}</h1>
          
          {art.summary && (
            <p className="text-xl text-muted-foreground mb-6">
              {art.summary}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={art.date}>
              {formatDate(art.date)}
            </time>
          </div>
        </header>

        {/* Image Gallery */}
        {art.images && art.images.length > 0 && (
          <div className="mb-12">
            <div className="grid gap-6">
              {art.images.map((image, index) => (
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
        {art.content && (
          <article className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <MDXContent source={art.content} />
          </article>
        )}

        {/* Navigation Footer */}
        <footer className="pt-8 border-t border-border">
          <Link
            href="/art"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to gallery
          </Link>
        </footer>
      </div>
    </div>
  )
}
