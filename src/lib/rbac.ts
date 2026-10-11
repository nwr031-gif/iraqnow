import { adminIsAuthed } from '@/lib/admin-server'
import { NextResponse } from 'next/server'

export type Role = 'READER' | 'JOURNALIST' | 'EDITOR' | 'ADMIN'

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: Role
}

const ROLE_LEVEL: Record<Role, number> = {
  READER: 0,
  JOURNALIST: 1,
  EDITOR: 2,
  ADMIN: 3,
}

export function hasRole(userRole: Role | undefined, minRole: Role): boolean {
  if (!userRole) return false
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[minRole]
}

/* مصفوفة الصلاحيات */
export const PERMISSIONS = {
  'dashboard.view': 'JOURNALIST',
  'articles.view.all': 'EDITOR',
  'articles.view.own': 'JOURNALIST',
  'articles.create': 'JOURNALIST',
  'articles.edit.own': 'JOURNALIST',
  'articles.edit.any': 'EDITOR',
  'articles.publish': 'EDITOR',
  'articles.delete': 'EDITOR',
  'categories.manage': 'EDITOR',
  'tags.manage': 'EDITOR',
  'media.manage': 'EDITOR',
  'podcasts.manage': 'EDITOR',
  'comments.moderate': 'EDITOR',
  'newsletter.view': 'EDITOR',
  'newsletter.send': 'EDITOR',
  'users.manage': 'ADMIN',
  'settings.manage': 'ADMIN',
  'ads.manage': 'ADMIN',
} as const satisfies Record<string, Role>

export type Permission = keyof typeof PERMISSIONS

export function can(userRole: Role | undefined, permission: Permission): boolean {
  const required = PERMISSIONS[permission] as Role
  return hasRole(userRole, required)
}

/**
 * المستخدم الحالي — مصادقة بكلمة مرور admin (كوكي موقّع)
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const authed = await adminIsAuthed()
  if (!authed) return null
  return { id: 'admin', name: 'المدير', email: 'admin@iraqnow.com', image: null, role: 'ADMIN' }
}

/**
 * الحماية في مسارات API — يُرجع 401 إن لم تكن الجلسة admin صالحة
 */
export async function requirePermission(permission: Permission): Promise<{ user: SessionUser } | NextResponse> {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح بالوصول', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  if (!can(user.role, permission)) {
    return NextResponse.json({ error: 'لا تملك الصلاحية لهذا الإجراء', code: 'FORBIDDEN' }, { status: 403 })
  }
  return { user }
}

export function isErrorResponse(res: any): res is NextResponse {
  return res instanceof NextResponse
}
