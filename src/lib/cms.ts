const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://192.168.10.41:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

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

export interface CMSWork {
  id: number
  documentId: string
  Title: string
  PublishDate: string | null
  Detail: string
  Cover: CMSMedia | null
  createdAt: string
  publishedAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve a Strapi media path (relative or absolute) to a full URL. */
export function getStrapiMediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${STRAPI_BASE_URL}${path}`
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
  const res = await fetch(`${STRAPI_BASE_URL}/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`CMS fetch failed for "${endpoint}": ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllCMSProjects(): Promise<CMSProject[]> {
  const data = await fetchCMS<{ data: CMSProject[] }>(
    'projects?populate=*&pagination[pageSize]=100'
  )
  return data.data.sort(
    (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
  )
}

export async function getCMSProjectById(documentId: string): Promise<CMSProject | null> {
  const data = await fetchCMS<{ data: CMSProject[] }>(
    `projects?filters[documentId][$eq]=${documentId}&populate=*`
  )
  return data.data[0] ?? null
}

// ─── Tech Notes ───────────────────────────────────────────────────────────────

export async function getAllCMSTechNotes(): Promise<CMSTechNote[]> {
  const data = await fetchCMS<{ data: CMSTechNote[] }>(
    'technotes?populate=*&pagination[pageSize]=100'
  )
  return data.data.sort(
    (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
  )
}

export async function getCMSTechNoteById(documentId: string): Promise<CMSTechNote | null> {
  const data = await fetchCMS<{ data: CMSTechNote[] }>(
    `technotes?filters[documentId][$eq]=${documentId}&populate=*`
  )
  return data.data[0] ?? null
}

// ─── Works ────────────────────────────────────────────────────────────────────

export async function getAllCMSWorks(): Promise<CMSWork[]> {
  const data = await fetchCMS<{ data: CMSWork[] }>(
    'works?populate=*&pagination[pageSize]=100'
  )
  return data.data.sort(
    (a, b) => new Date(getSortDate(b)).getTime() - new Date(getSortDate(a)).getTime()
  )
}

export async function getCMSWorkById(documentId: string): Promise<CMSWork | null> {
  const data = await fetchCMS<{ data: CMSWork[] }>(
    `works?filters[documentId][$eq]=${documentId}&populate=*`
  )
  return data.data[0] ?? null
}
