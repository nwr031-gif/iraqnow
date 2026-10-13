/**
 * عميل Meilisearch — متوافق مع مخطط الفهرس المُزامَن:
 * id, slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar,
 * categorySlug, governorateSlug, breaking, featured, image, viewCount,
 * readingTime, publishedAt, publishedAtTs, updatedAt, authorName
 */
import { Meilisearch } from 'meilisearch'

const HOST = process.env.MEILISEARCH_HOST
const SEARCH_KEY = process.env.MEILISEARCH_SEARCH_KEY

export const INDEXES = { articles: 'articles' }

let client: Meilisearch | null = null

function getClient(): Meilisearch | null {
  if (!HOST || !SEARCH_KEY) return null
  if (!client) client = new Meilisearch({ host: HOST, apiKey: SEARCH_KEY })
  return client
}

export interface SearchParams {
  q?: string
  categorySlug?: string
  governorateSlug?: string
  breaking?: boolean
  featured?: boolean
  sort?: string[]
  limit?: number
  offset?: number
  facets?: string[]
}

export async function searchArticles(params: SearchParams) {
  const index = getClient()?.index(INDEXES.articles)
  if (!index) throw new Error('Meilisearch غير مهيأ')

  const filter: string[] = []
  if (params.categorySlug) filter.push(`categorySlug = "${params.categorySlug}"`)
  if (params.governorateSlug) filter.push(`governorateSlug = "${params.governorateSlug}"`)
  if (params.breaking !== undefined) filter.push(`breaking = ${params.breaking}`)
  if (params.featured !== undefined) filter.push(`featured = ${params.featured}`)

  return index.search(params.q || '', {
    filter: filter.length > 0 ? filter.join(' AND ') : undefined,
    sort: params.sort && params.sort.length ? params.sort : ['publishedAtTs:desc'],
    limit: Math.min(params.limit || 20, 50),
    offset: params.offset || 0,
    facets: params.facets || ['categorySlug'],
    attributesToHighlight: ['title_ar', 'title_en', 'excerpt_ar', 'excerpt_en'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
  })
}

export async function getArticleSuggestions(query: string, limit = 5) {
  const index = getClient()?.index(INDEXES.articles)
  if (!index) return { hits: [] }
  return index.search(query, {
    limit,
    attributesToRetrieve: ['title_ar', 'title_en', 'slug', 'image'],
    attributesToHighlight: ['title_ar'],
  })
}
