import { MetadataRoute } from 'next'
import { site } from '../../site.config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = site.url || 'https://jqiu006.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
