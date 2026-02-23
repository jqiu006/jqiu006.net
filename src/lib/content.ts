import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');

export interface BaseContent {
  slug: string;
  title: string;
  date: string;
  content: string;
  readingTime: string;
}

export interface Project extends BaseContent {
  year: number;
  summary: string;
  tags: string[];
  cover: string;
  repo?: string;
  tech: string[];
  status: 'completed' | 'ongoing';
}

export interface Note extends BaseContent {
  tags: string[];
  summary?: string;
}

export interface Work extends BaseContent {
  summary: string;
  tags: string[];
  images: {
    src: string;
    alt: string;
    w: number;
    h: number;
  }[];
  videos?: {
    src: string;
    alt: string;
    type: 'mp4' | 'avi' | 'mkv';
  }[];
  tools?: string[];
  category: 'digital-art' | '3d' | 'interactive' | 'design' | 'photography' | 'web-dev';
  featured?: boolean;
  meta?: {
    exif?: {
      camera: string;
      lens: string;
      iso: number;
      shutter: string;
      aperture: string;
    };
  };
}

// Keep legacy interfaces for backward compatibility
export interface Artwork extends BaseContent {
  summary: string;
  images: {
    src: string;
    alt: string;
    w: number;
    h: number;
  }[];
  category: 'digital-art' | '3d' | 'illustration';
}

export interface Photo extends BaseContent {
  summary: string;
  images: {
    src: string;
    alt: string;
    w: number;
    h: number;
  }[];
  meta?: {
    exif?: {
      camera: string;
      lens: string;
      iso: number;
      shutter: string;
      aperture: string;
    };
  };
}

function getContentFiles(type: string): string[] {
  const fullPath = path.join(contentDirectory, type);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter(file => file.endsWith('.mdx'));
}

function parseContent<T extends BaseContent>(
  type: string,
  filename: string
): T {
  const fullPath = path.join(contentDirectory, type, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const slug = filename.replace(/\.mdx$/, '');
  const readingTimeResult = readingTime(content);

  return {
    slug,
    content,
    readingTime: readingTimeResult.text,
    ...data,
  } as T;
}

export function getAllProjects(): Project[] {
  const files = getContentFiles('projects');
  const projects = files
    .map(file => parseContent<Project>('projects', file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    return parseContent<Project>('projects', `${slug}.mdx`);
  } catch {
    return null;
  }
}

export function getAllNotes(): Note[] {
  const files = getContentFiles('notes');
  const notes = files
    .map(file => parseContent<Note>('notes', file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return notes;
}

export function getNoteBySlug(slug: string): Note | null {
  try {
    return parseContent<Note>('notes', `${slug}.mdx`);
  } catch {
    return null;
  }
}

export function getAllArtwork(): Artwork[] {
  const files = getContentFiles('art');
  const artwork = files
    .map(file => parseContent<Artwork>('art', file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return artwork;
}

export function getArtworkBySlug(slug: string): Artwork | null {
  try {
    return parseContent<Artwork>('art', `${slug}.mdx`);
  } catch {
    return null;
  }
}

export function getAllPhotos(): Photo[] {
  const files = getContentFiles('photo');
  const photos = files
    .map(file => parseContent<Photo>('photo', file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return photos;
}

export function getPhotoBySlug(slug: string): Photo | null {
  try {
    return parseContent<Photo>('photo', `${slug}.mdx`);
  } catch {
    return null;
  }
}

// New Works functions
export function getAllWorks(): Work[] {
  const files = getContentFiles('works');
  const works = files
    .map(file => parseContent<Work>('works', file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return works;
}

export function getWorkBySlug(slug: string): Work | null {
  try {
    return parseContent<Work>('works', `${slug}.mdx`);
  } catch {
    return null;
  }
}

export function getFeaturedWorks(): Work[] {
  return getAllWorks().filter(work => work.featured === true);
}

export function getWorksByCategory(category: Work['category']): Work[] {
  return getAllWorks().filter(work => work.category === category);
}

export function getAllTags(type: 'projects' | 'notes' | 'works'): string[] {
  let content: { tags?: string[] }[];
  switch (type) {
    case 'projects':
      content = getAllProjects();
      break;
    case 'notes':
      content = getAllNotes();
      break;
    case 'works':
      content = getAllWorks();
      break;
    default:
      content = [];
  }
  const tags = content.flatMap(item => item.tags || []);
  return Array.from(new Set(tags)).sort();
}

export function getContentByTag<T extends BaseContent & { tags: string[] }>(
  content: T[],
  tag: string
): T[] {
  return content.filter(item => item.tags?.includes(tag));
}

export function searchContent<T extends BaseContent>(
  content: T[],
  query: string
): T[] {
  const lowercaseQuery = query.toLowerCase();
  return content.filter(item =>
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.content.toLowerCase().includes(lowercaseQuery)
  );
}
