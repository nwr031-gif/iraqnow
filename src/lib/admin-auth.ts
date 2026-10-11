/**
 * مصادقة لوحة التحكم — كلمة مرور واحدة + كوكي موقّع (بدون تسجيل دخول عام)
 */

export const ADMIN_COOKIE = 'iqn_admin'
export const ADMIN_PASSWORD_FALLBACK = 'Noor07813415176@@'
export const ADMIN_COOKIE_SALT = 'iraqnow-admin-v1'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'ADMIN'
  image?: string
}

export const ADMIN_USER: AdminUser = {
  id: 'admin',
  name: 'المدير',
  email: 'admin@iraqnow.com',
  role: 'ADMIN',
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || ADMIN_PASSWORD_FALLBACK
}

/* التوكين المتوقع في الكوكي = SHA-256(ملح::كلمة المرور) */
export async function expectedAdminToken(): Promise<string> {
  const salt = process.env.ADMIN_COOKIE_SECRET || ADMIN_COOKIE_SALT
  const data = new TextEncoder().encode(`${salt}::${getAdminPassword()}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false
  const expected = await expectedAdminToken()
  const given = new TextEncoder().encode(password)
  const data = new TextEncoder().encode(`${process.env.ADMIN_COOKIE_SECRET || ADMIN_COOKIE_SALT}::`)
  const prefix = new Uint8Array(data)
  const combined = new Uint8Array(prefix.length + given.length)
  combined.set(prefix)
  combined.set(given, prefix.length)
  const digest = await crypto.subtle.digest('SHA-256', combined)
  const token = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return token === expected
}
