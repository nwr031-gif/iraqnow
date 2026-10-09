import { ArticleForm } from '@/components/admin/ArticleForm'
import { getSessionUser } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const user = await getSessionUser()
  return <ArticleForm currentUserId={user?.id || 'user-admin'} />
}
