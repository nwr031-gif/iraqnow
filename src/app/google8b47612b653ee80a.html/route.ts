export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response('google-site-verification: google8b47612b653ee80a.html', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
