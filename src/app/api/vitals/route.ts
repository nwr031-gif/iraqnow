import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { SB_URL, SB_KEY } from '@/lib/supabase-config'

/**
 * استقبال مقاييس Web Vitals الحقيقية من الزوار (RUM)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, value, rating, path } = body || {}

    if (!name || typeof value !== 'number') {
      return new NextResponse(null, { status: 204 })
    }

    const record = {
      metric: String(name).slice(0, 16),
      value: Math.round(value),
      rating: String(rating || '').slice(0, 12),
      path: String(path || '/').slice(0, 200),
      created_at: new Date().toISOString(),
    }

    /* محاولة التخزين في Supabase */
    if (SB_URL && SB_KEY) {
      try {
        await fetch(`${SB_URL}/rest/v1/web_vitals`, {
          method: 'POST',
          headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${SB_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify([record]),
        })
      } catch { /* تجاهل */ }
    }

    /* محاولة Prisma */
    try {
      const db = await getPrisma()
      /* نموذج WebVital غير موجود افتراضياً — السجلات تُطبع فقط */
      if (db && process.env.NODE_ENV === 'development') {
        console.log('[vitals]', record.metric, record.value, record.rating)
      }
    } catch { /* تجاهل */ }

    return new NextResponse(null, { status: 204 })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
