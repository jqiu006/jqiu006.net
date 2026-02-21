import { MetadataRoute } from 'next'
import { getAllProjects, getAllNotes, getAllArtwork, getAllPhotos } from '@/lib/content'
import { site } from '../../site.config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url || 'https://jqiu006.com'

  // Get all content
  const projects = getAllProjects()
  const notes = getAllNotes()
  const artwork = getAllArtwork()
  const photos = getAllPhotos()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/art`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/photo`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic project pages
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic note pages
  const notePages = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic artwork pages
  const artworkPages = artwork.map((art) => ({
    url: `${baseUrl}/art/${art.slug}`,
    lastModified: new Date(art.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic photo pages
  const photoPages = photos.map((photo) => ({
    url: `${baseUrl}/photo/${photo.slug}`,
    lastModified: new Date(photo.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...projectPages,
    ...notePages,
    ...artworkPages,
    ...photoPages,
  ]
}
