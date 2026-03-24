const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL ?? ''
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

// ─── Media ────────────────────────────────────────────────────────────────────

interface CMSMediaFormat {
  url: string
  width?: number
  height?: number
}

export interface CMSMedia {
  url: string
  mime?: string
  width?: number | null
  height?: number | null
  formats?: {
    large?: CMSMediaFormat
    medium?: CMSMediaFormat
    small?: CMSMediaFormat
    thumbnail?: CMSMediaFormat
  }
}

// ─── Strapi Blocks (rich text) ────────────────────────────────────────────────

export interface StrapiTextNode {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

export interface StrapiBlock {
  type: string
  children: StrapiTextNode[]
}

// ─── Content types ────────────────────────────────────────────────────────────

export interface CMSProject {
  id: number
  documentId: string
  Title: string
  PublishDate: string | null
  Detail: string
  createdAt: string
  publishedAt: string
}

export interface CMSTechNote {
  id: number
  documentId: string
  Title: string
  Note: string
  PublishDate: string | null
  createdAt: string
  publishedAt: string
}

export interface CMSAbout {
  background: StrapiBlock[]
}

export interface CMSWork {
  id: number
  documentId: string
  Title: string
  PublishDate: string | null
  Detail: string
  Cover: CMSMedia | null
  Top: boolean | null
  createdAt: string
  publishedAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a Strapi media path to a proxied URL served by this Next.js app.
 * Converts internal Strapi URLs (absolute or relative) to /strapi-media/...
 * so the browser never needs direct access to the internal network.
 */
export function getStrapiMediaUrl(path: string): string {
  if (!path) return ''
  // Already an absolute URL pointing to Strapi — extract just the /uploads/... part
  if (path.startsWith('http')) {
    try {
      const url = new URL(path)
      if (url.pathname.startsWith('/uploads/')) {
        return `/strapi-media/${url.pathname.slice('/uploads/'.length)}`
      }
    } catch {
      // fall through
    }
    return path
  }
  // Relative path like /uploads/foo.jpg
  if (path.startsWith('/uploads/')) {
    return `/strapi-media/${path.slice('/uploads/'.length)}`
  }
  return path
}

/**
 * Replace all internal Strapi media URLs inside a rich-text/markdown string
 * with proxied /strapi-media/... URLs so embedded images and videos load for
 * users outside the internal network.
 */
export function proxyStrapiUrls(content: string): string {
  if (!content) return content
  // Match http(s)://host:port/uploads/... — replace with /strapi-media/...
  return content.replace(
    /https?:\/\/[^/\s"')]+\/uploads\/([^\s"')]+)/g,
    '/strapi-media/$1'
  )
}

/** Return the best thumbnail URL for a cover image. */
export function getCoverUrl(cover: CMSMedia): string {
  const preferred =
    cover.formats?.medium?.url ||
    cover.formats?.small?.url ||
    cover.formats?.large?.url ||
    cover.url
  return getStrapiMediaUrl(preferred)
}

/** Return PublishDate for display, or null if not set. */
export function getDisplayDate(entry: { PublishDate: string | null }): string | null {
  return entry.PublishDate || null
}

/** Return a date for sorting purposes (falls back to createdAt). */
function getSortDate(entry: { PublishDate: string | null; createdAt: string }): string {
  return entry.PublishDate || entry.createdAt
}

// ─── Internal fetch ───────────────────────────────────────────────────────────

async function fetchCMS<T>(endpoint: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(`${STRAPI_BASE_URL}/api/${endpoint}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: 60 },
      signal: controller.signal,
    })
    if (!res.ok) {
      throw new Error(`CMS fetch failed for "${endpoint}": ${res.status} ${res.statusText}`)
    }
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllCMSProjects(): Promise<CMSProject[]> {
  try {
    const data = await fetchCMS<{ data: CMSProject[] }>(
      'projects?populate=*&pagination[pageSize]=100'
    )
    return data.data.sort(
      (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
    )
  } catch {
    return []
  }
}

export async function getCMSProjectById(documentId: string): Promise<CMSProject | null> {
  try {
    const data = await fetchCMS<{ data: CMSProject[] }>(
      `projects?filters[documentId][$eq]=${documentId}&populate=*`
    )
    const item = data.data[0] ?? null
    if (item) item.Detail = proxyStrapiUrls(item.Detail)
    return item
  } catch {
    return null
  }
}

// ─── Tech Notes ───────────────────────────────────────────────────────────────

export async function getAllCMSTechNotes(): Promise<CMSTechNote[]> {
  try {
    const data = await fetchCMS<{ data: CMSTechNote[] }>(
      'technotes?populate=*&pagination[pageSize]=100'
    )
    return data.data.sort(
      (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
    )
  } catch {
    return []
  }
}

export async function getCMSTechNoteById(documentId: string): Promise<CMSTechNote | null> {
  try {
    const data = await fetchCMS<{ data: CMSTechNote[] }>(
      `technotes?filters[documentId][$eq]=${documentId}&populate=*`
    )
    const item = data.data[0] ?? null
    if (item) item.Note = proxyStrapiUrls(item.Note)
    return item
  } catch {
    return null
  }
}

// ─── Works ────────────────────────────────────────────────────────────────────

export async function getAllCMSWorks(): Promise<CMSWork[]> {
  try {
    const data = await fetchCMS<{ data: CMSWork[] }>(
      'works?populate=*&pagination[pageSize]=100'
    )
    return data.data.sort(
      (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
    )
  } catch {
    return []
  }
}

export async function getCMSWorkById(documentId: string): Promise<CMSWork | null> {
  try {
    const data = await fetchCMS<{ data: CMSWork[] }>(
      `works?filters[documentId][$eq]=${documentId}&populate=*`
    )
    const item = data.data[0] ?? null
    if (item) item.Detail = proxyStrapiUrls(item.Detail)
    return item
  } catch {
    return null
  }
}

// ─── About ────────────────────────────────────────────────────────────────────

export async function getCMSAbout(): Promise<CMSAbout | null> {
  try {
    const data = await fetchCMS<{ data: CMSAbout }>('about')
    return data.data ?? null
  } catch {
    return null
  }
}
