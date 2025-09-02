import { NextResponse } from 'next/server'
import { getAllProjects, getAllNotes, getAllArtwork, getAllPhotos } from '@/lib/content'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    let data
    switch (type) {
      case 'projects':
        data = getAllProjects()
        break
      case 'notes':
        data = getAllNotes()
        break
      case 'artwork':
        data = getAllArtwork()
        break
      case 'photos':
        data = getAllPhotos()
        break
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
