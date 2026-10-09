import { MeiliSearch } from 'meilisearch'
import { INDEXES } from '../src/lib/meilisearch'

const host = process.env.MEILISEARCH_HOST!
const masterKey = process.env.MEILISEARCH_MASTER_KEY!

const meilisearch = new MeiliSearch({ host, apiKey: masterKey })

async function setupIndexes() {
  console.log('🔧 Setting up Meilisearch indexes...')

  const indexes = Object.values(INDEXES)

  for (const indexName of indexes) {
    try {
      await meilisearch.getIndex(indexName)
      console.log(`✅ Index "${indexName}" already exists`)
    } catch {
      await meilisearch.createIndex(indexName, { primaryKey: 'id' })
      console.log(`✨ Created index "${indexName}"`)
    }
  }

  // Configure articles index
  console.log('⚙️ Configuring articles index...')
  const articlesIndex = meilisearch.index(INDEXES.articles)
  await articlesIndex.updateSettings({
    searchableAttributes: [
      'title.ar', 'title.ku', 'title.en',
      'excerpt.ar', 'excerpt.ku', 'excerpt.en',
      'content.ar', 'content.ku', 'content.en',
      'category.name.ar', 'category.name.ku', 'category.name.en',
      'tags.name.ar', 'tags.name.ku', 'tags.name.en',
      'governorate.name.ar', 'governorate.name.ku', 'governorate.name.en',
      'author.name',
    ],
    filterableAttributes: [
      'status', 'locale', 'categoryId', 'category.slug',
      'tags.slug', 'governorateId', 'districtId', 'authorId',
      'breaking', 'featured', 'publishedAt',
    ],
    sortableAttributes: ['publishedAt', 'viewCount', 'createdAt', 'readingTime'],
    rankingRules: [
      'words', 'typo', 'proximity', 'attribute', 'sort', 'exactness',
      'publishedAt:desc', 'viewCount:desc',
    ],
    distinctAttribute: 'id',
    pagination: { maxTotalHits: 1000 },
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
    },
    faceting: { maxValuesPerFacet: 100 },
  })

  await articlesIndex.updateSynonyms({
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

  // Configure categories index
  console.log('⚙️ Configuring categories index...')
  const catIndex = meilisearch.index(INDEXES.categories)
  await catIndex.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'slug'],
    filterableAttributes: ['parentId', 'isActive'],
    sortableAttributes: ['order'],
  })

  // Configure tags index
  console.log('⚙️ Configuring tags index...')
  const tagIndex = meilisearch.index(INDEXES.tags)
  await tagIndex.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'slug'],
  })

  // Configure governorates index
  console.log('⚙️ Configuring governorates index...')
  const govIndex = meilisearch.index(INDEXES.governorates)
  await govIndex.updateSettings({
    searchableAttributes: ['name.ar', 'name.ku', 'name.en', 'code'],
    filterableAttributes: ['code'],
  })

  console.log('🎉 Meilisearch setup complete!')
}

setupIndexes().catch(console.error)