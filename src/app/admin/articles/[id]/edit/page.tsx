import { notFound } from 'next/navigation'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { getSessionUser } from '@/lib/rbac'
import { getAdminArticles } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, articles] = await Promise.all([getSessionUser(), getAdminArticles()])

  const article = articles.find((a) => a.id === id)
  if (!article) notFound()

  const initialData = {
    id: article.id,
    slug: article.slug,
    status: article.status,
    breaking: article.breaking,
    featured: article.featured,
    categorySlug: article.categorySlug,
    governorateSlug: article.governorateSlug,
    image: article.image,
    readingTime: article.readingTime,
    tagSlugs: article.tagSlugs,
    authorId: article.authorId,
    translations: (['ar', 'ku', 'en'] as const).map((locale) => {
      const t = article.translations.find((tr) => tr.locale === locale)
      return {
        locale,
        title: t?.title || '',
        excerpt: t?.excerpt || '',
        content: t?.content || '',
        seoTitle: '',
        seoDesc: '',
      }
    }),
  }

  return <ArticleForm initialData={initialData} currentUserId={user?.id || 'user-admin'} />
}
