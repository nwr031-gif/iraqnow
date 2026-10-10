/**
 * عميل Prisma — تحميل كسول وآمن لبيئات Cloudflare
 * Lazy-loads Prisma only when a database is actually reachable.
 * On Cloudflare Workers the module is excluded from the bundle and
 * loading fails gracefully → the app falls back to the in-memory store.
 */

let _prisma: any = null
let _prismaFailed = false
let _prismaTried = false

export async function getPrisma(): Promise<any | null> {
  if (_prisma) return _prisma
  if (_prismaFailed) return null

  // لا نحاول أبداً إذا كان الاتصال بقاعدة البيانات غير مهيأ
  const url = process.env.DATABASE_URL
  if (!url || url.includes('[YOUR-PASSWORD]') || url.includes('placeholder')) {
    _prismaFailed = true
    return null
  }

  // في بيئة Cloudflare Workers لا نحاول تحميل Prisma/PG إطلاقاً
  if (process.env.NEXT_RUNTIME === 'edge' || isCloudflareWorker()) {
    _prismaFailed = true
    return null
  }

  if (_prismaTried) return null
  _prismaTried = true

  try {
    // أسماء متغيرة لتجنّب التحليل الثابت من قِبَل المُجمّعات
    const clientName = '@prisma/' + 'client'
    const adapterName = '@prisma/' + 'adapter-pg'

    const { PrismaClient } = await import(/* webpackIgnore: true */ clientName)
    const { PrismaPg } = await import(/* webpackIgnore: true */ adapterName)

    const adapter = new PrismaPg({ connectionString: url })
    _prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    return _prisma
  } catch {
    _prismaFailed = true
    return null
  }
}

function isCloudflareWorker(): boolean {
  try {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.includes('Cloudflare-Workers')
    )
  } catch {
    return false
  }
}

/** @deprecated استخدم getPrisma() */
export const prisma = null
export default getPrisma
