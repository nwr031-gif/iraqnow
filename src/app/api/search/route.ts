import { NextRequest, NextResponse } from 'next/server'
import { searchArticles, getArticleSuggestions, INDEXES } from '@/lib/meilisearch'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'search': {
        const q = searchParams.get('q') || ''
        const locale = (searchParams.get('locale') as 'ar' | 'ku' | 'en') || 'ar'
        const categorySlug = searchParams.get('category')
        const tagSlug = searchParams.get('tag')
        const governorateId = searchParams.get('governorate')
        const districtId = searchParams.get('district')
        const breaking = searchParams.get('breaking') === 'true'
        const featured = searchParams.get('featured') === 'true'
        const sort = searchParams.get('sort')?.split(',')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const result = await searchArticles({
          q,
          locale,
          categorySlug: categorySlug ?? undefined,
          tagSlug: tagSlug ?? undefined,
          governorateId: governorateId ?? undefined,
          districtId: districtId ?? undefined,
          breaking,
          featured,
          status: 'PUBLISHED',
          sort: sort || ['publishedAt:desc'],
          limit,
          offset,
          facets: ['category.slug', 'tags.slug', 'governorateId', 'authorId'],
        })

        return NextResponse.json(result)
      }

      case 'suggest': {
        const q = searchParams.get('q') || ''
        const locale = (searchParams.get('locale') as 'ar' | 'ku' | 'en') || 'ar'
        const limit = parseInt(searchParams.get('limit') || '5')

        if (q.length < 2) {
          return NextResponse.json({ hits: [] })
        }

        const result = await getArticleSuggestions(q, locale, limit)
        return NextResponse.json(result)
      }

      case 'facets': {
        const locale = (searchParams.get('locale') as 'ar' | 'ku' | 'en') || 'ar'
        const index = INDEXES.articles
        
        return NextResponse.json({ message: 'Use search with facets parameter' })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}