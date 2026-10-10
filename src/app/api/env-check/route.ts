import { NextResponse } from 'next/server'

export async function GET() {
  const envKeys = Object.keys(process.env || {})
  const check = {
    hasProcess: typeof process !== 'undefined',
    envCount: envKeys.length,
    has: {
      MEILISEARCH_HOST: !!process.env.MEILISEARCH_HOST,
      MEILISEARCH_SEARCH_KEY: !!process.env.MEILISEARCH_SEARCH_KEY,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    },
    nodeVersion: process.version || null,
    bufferWorks: typeof Buffer !== 'undefined',
  }
  return NextResponse.json(check)
}
