import { NextRequest, NextResponse } from 'next/server'

/**
 * IndexNow — فهرسة فورية في Bing وYandex وSeznam عند النشر
 * مجاني بلا حدود، بدون حساب (المفتاح مجرد ملف نصي في جذر الموقع)
 */

const INDEXNOW_KEY = 'f60c98986db45620fc97ade3c65b3fcd'
const HOST = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'iraqnow.pages.dev'

export async function GET() {
  /* المفتاح يُخدم كملف نصي للتحقق */
  return new NextResponse(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain' },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const urls: string[] = (body?.urls || []).map(String).slice(0, 100)

    if (urls.length === 0) {
      return NextResponse.json({ error: 'قائمة الروابط مطلوبة' }, { status: 400 })
    }

    const keyLocation = `${process.env.NEXT_PUBLIC_APP_URL || 'https://iraqnow.pages.dev'}/${INDEXNOW_KEY}.txt`

    /* إرسال غير معترض به — لا يعطل النشر */
    const pingPromise = fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(8000),
    })
      .then((res) => ({ ok: res.status === 200 || res.status === 202 }))
      .catch(() => ({ ok: false }))

    /* انتظار حتى 8 ثوانٍ فقط ثم المتابعة */
    const result = await Promise.race([pingPromise, new Promise<{ ok: boolean }>((r) => setTimeout(() => r({ ok: false }), 8500))])

    return NextResponse.json({ success: true, indexed: result.ok, count: urls.length })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

