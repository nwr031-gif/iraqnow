/**
 * أعداد المقالات المنشورة حسب المحافظة — من Supabase وقت البناء
 * تُستخدم في صفحة الخريطة والرئيسية
 */
export async function getGovernorateCounts(): Promise<Record<string, number> | null> {
  const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
  const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!SB || !KEY) return null
  try {
    const res = await fetch(`${SB}/rest/v1/articles?select=governorate_slug&status=eq.PUBLISHED`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: 'no-store',
    })
    if (res.status !== 200) return null
    const rows: Array<{ governorate_slug: string | null }> = await res.json()
    const counts: Record<string, number> = {}
    let total = 0
    for (const r of rows) {
      if (r.governorate_slug) {
        counts[r.governorate_slug] = (counts[r.governorate_slug] || 0) + 1
        total++
      }
    }
    return total >= 5 ? counts : null
  } catch {
    return null
  }
}
