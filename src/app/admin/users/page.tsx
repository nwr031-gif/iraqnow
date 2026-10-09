import { UsersManager } from '@/components/admin/UsersManager'
import { getSessionUser } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const user = await getSessionUser()
  return <UsersManager currentUserId={user?.id || ''} />
}
