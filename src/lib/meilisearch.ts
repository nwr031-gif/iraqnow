import { MeiliSearch } from 'meilisearch'

const host = process.env.MEILISEARCH_HOST!
const masterKey = process.env.MEILISEARCH_MASTER_KEY!
const adminKey = process.env.MEILISEARCH_ADMIN_KEY!
const searchKey = process.env.MEILISEARCH_SEARCH_KEY!

export const meilisearch = new MeiliSearch({
  host,
  apiKey: masterKey,
})

export const meilisearchAdmin = new MeiliSearch({
  host,
  apiKey: adminKey,
})

export const meilisearchSearch = new MeiliSearch({
  host,
  apiKey: searchKey,
})

export const INDEXES = {
  articles: 'articles',
  categories: 'categories',
  tags: 'tags',
  governorates: 'governorates',
} as const

export async function setupIndexes() {
  const indexes = Object.values(INDEXES)
  
  for (const indexName of indexes) {
    try {
      await meilisearch.getIndex(indexName)
    } catch {
      await meilisearch.createIndex(indexName, { primaryKey: 'id' })
    }
  }

  await configureArticleIndex()
  await configureCategoryIndex()
  await configureTagIndex()
  await configureGovernorateIndex()
}

async function configureArticleIndex() {
  const index = meilisearchAdmin.index(INDEXES.articles)
  
  await index.updateSettings({
    searchableAttributes: [
      'title.ar',
      'title.ku',
      'title.en',
      'excerpt.ar',
      'excerpt.ku',
      'excerpt.en',
      'content.ar',
      'content.ku',
      'content.en',
      'category.name.ar',
      'category.name.ku',
      'category.name.en',
      'tags.name.ar',
      'tags.name.ku',
      'tags.name.en',
      'governorate.name.ar',
      'governorate.name.ku',
      'governorate.name.en',
      'author.name',
    ],
    filterableAttributes: [
      'status',
      'locale',
      'categoryId',
      'category.slug',
      'tags.slug',
      'governorateId',
      'districtId',
      'authorId',
      'breaking',
      'featured',
      'publishedAt',
    ],
    sortableAttributes: [
      'publishedAt',
      'viewCount',
      'createdAt',
      'readingTime',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'publishedAt:desc',
      'viewCount:desc',
    ],
    distinctAttribute: 'id',
    pagination: {
      maxTotalHits: 1000,
    },
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    },
    faceting: {
      maxValuesPerFacet: 100,
    },
  })

  await index.updateSynonyms({
    synonyms: {
      'العراق': ['عراق', 'Iraq', 'عێراق'],
      'بغداد': ['Baghdad', 'بەغداد'],
      'كردستان': ['Kurdistan', 'کوردستان'],
      'الانتخابات': ['elections', 'هەڵبژاردن'],
      'الاقتصاد': ['economy', 'أپووری'],
      'السياسة': ['politics', 'سیاسەت'],
      'الرياضة': ['sports', 'وەرزش'],
      'التعليم': ['education', 'پەروەردە'],
      'الصحة': ['health', 'تەندروستی'],
    },
  })
}

async function configureCategoryIndex() {
  const index = meilisearchAdmin.index(INDEXES.categories)
  await index.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'slug'],
    filterableAttributes: ['parentId', 'isActive'],
    sortableAttributes: ['order'],
  })
}

async function configureTagIndex() {
  const index = meilisearchAdmin.index(INDEXES.tags)
  await index.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'slug'],
    filterableAttributes: [],
  })
}

async function configureGovernorateIndex() {
  const index = meilisearchAdmin.index(INDEXES.governorates)
  await index.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'code'],
    filterableAttributes: ['code'],
    sortableAttributes: ['name.ar'],
  })
}

export async function indexArticle(article: any) {
  const index = meilisearchAdmin.index(INDEXES.articles)
  const documents = ['ar', 'ku', 'en'].map(locale => ({
    id: `${article.id}_${locale}`,
    articleId: article.id,
    locale,
    title: article.translations?.[locale]?.title || '',
    excerpt: article.translations?.[locale]?.excerpt || '',
    content: article.translations?.[locale]?.content || '',
    category: article.category ? {
      id: article.category.id,
      slug: article.category.slug,
      name: {
        ar: article.category.translations?.find((t: any) => t.locale === 'ar')?.name || '',
        ku: article.category.translations?.find((t: any) => t.locale === 'ku')?.name || '',
        en: article.category.translations?.find((t: any) => t.locale === 'en')?.name || '',
      },
    } : null,
    tags: article.tags?.map((at: any) => ({
      slug: at.tag.slug,
      name: {
        ar: at.tag.translations?.find((t: any) => t.locale === 'ar')?.name || '',
        ku: at.tag.translations?.find((t: any) => t.locale === 'ku')?.name || '',
        en: at.tag.translations?.find((t: any) => t.locale === 'en')?.name || '',
      },
    })) || [],
    governorate: article.location?.governorate ? {
      id: article.location.governorate.id,
      name: {
        ar: article.location.governorate.translations?.find((t: any) => t.locale === 'ar')?.name || '',
        ku: article.location.governorate.translations?.find((t: any) => t.locale === 'ku')?.name || '',
        en: article.location.governorate.translations?.find((t: any) => t.locale === 'en')?.name || '',
      },
    } : null,
    district: article.location?.district ? {
      id: article.location.district.id,
      name: {
        ar: article.location.district.translations?.find((t: any) => t.locale === 'ar')?.name || '',
        ku: article.location.district.translations?.find((t: any) => t.locale === 'ku')?.name || '',
        en: article.location.district.translations?.find((t: any) => t.locale === 'en')?.name || '',
      },
    } : null,
    author: {
      id: article.author.id,
      name: article.author.name,
    },
    status: article.status,
    breaking: article.breaking,
    featured: article.featured,
    publishedAt: article.publishedAt,
    viewCount: article.viewCount || 0,
    readingTime: article.readingTime,
    createdAt: article.createdAt,
  }))

  await index.addDocuments(documents)
}

export async function removeArticleFromIndex(articleId: string) {
  const index = meilisearchAdmin.index(INDEXES.articles)
  await index.deleteDocuments(['ar', 'ku', 'en'].map(l => `${articleId}_${l}`))
}

export async function searchArticles(params: {
  q?: string
  locale?: 'ar' | 'ku' | 'en'
  categoryId?: string
  categorySlug?: string
  tagSlug?: string
  governorateId?: string
  districtId?: string
  authorId?: string
  breaking?: boolean
  featured?: boolean
  status?: string
  sort?: string[]
  limit?: number
  offset?: number
  facets?: string[]
}) {
  const index = meilisearchSearch.index(INDEXES.articles)
  
  const filter: string[] = []
  if (params.locale) filter.push(`locale = "${params.locale}"`)
  if (params.status) filter.push(`status = "${params.status}"`)
  if (params.categoryId) filter.push(`categoryId = "${params.categoryId}"`)
  if (params.categorySlug) filter.push(`category.slug = "${params.categorySlug}"`)
  if (params.tagSlug) filter.push(`tags.slug = "${params.tagSlug}"`)
  if (params.governorateId) filter.push(`governorateId = "${params.governorateId}"`)
  if (params.districtId) filter.push(`districtId = "${params.districtId}"`)
  if (params.authorId) filter.push(`authorId = "${params.authorId}"`)
  if (params.breaking !== undefined) filter.push(`breaking = ${params.breaking}`)
  if (params.featured !== undefined) filter.push(`featured = ${params.featured}`)

  const result = await index.search(params.q || '', {
    filter: filter.length > 0 ? filter.join(' AND ') : undefined,
    sort: params.sort,
    limit: params.limit || 20,
    offset: params.offset || 0,
    facets: params.facets || ['category.slug', 'tags.slug', 'governorateId', 'status'],
    attributesToHighlight: ['title.*', 'excerpt.*', 'content.*'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
    showMatchesPosition: true,
  })

  return result
}

export async function getArticleSuggestions(query: string, locale: 'ar' | 'ku' | 'en', limit = 5) {
  const index = meilisearchSearch.index(INDEXES.articles)
  return index.search(query, {
    filter: `locale = "${locale}" AND status = "PUBLISHED"`,
    limit,
    attributesToRetrieve: ['title', 'slug', 'articleId'],
    attributesToHighlight: ['title.*'],
  })
}