import { PrismaClient } from '@prisma/client'
import { indexArticle, setupIndexes } from '../src/lib/meilisearch'

const prisma = new PrismaClient()

async function indexArticles() {
  console.log('📰 Indexing articles to Meilisearch...')

  await setupIndexes()

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      translations: true,
      category: { include: { translations: true } },
      tags: { include: { tag: { include: { translations: true } } } },
      media: { include: { media: true }, take: 1 },
      author: true,
      location: {
        include: {
          governorate: { include: { translations: true } },
          district: { include: { translations: true } },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })

  console.log(`Found ${articles.length} published articles`)

  for (const article of articles) {
    try {
      await indexArticle(article)
      console.log(`✅ Indexed: ${article.slug}`)
    } catch (error) {
      console.error(`❌ Failed to index ${article.slug}:`, error)
    }
  }

  console.log('🎉 Article indexing complete!')
}

indexArticles()
  .catch(console.error)
  .finally(() => prisma.$disconnect())