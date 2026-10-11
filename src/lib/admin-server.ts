/**
 * أدوات خادم مصادقة admin — قراءة الكوكي والتحقق
 * (ملف server-only — لا يُستورد في مكونات العميل)
 */
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, expectedAdminToken } from './admin-auth'

export async function adminIsAuthed(): Promise<boolean> {
  try {
    const store = await cookies()
    const token = store.get(ADMIN_COOKIE)?.value
    if (!token) return false
    return token === (await expectedAdminToken())
  } catch {
    return false
  }
}
