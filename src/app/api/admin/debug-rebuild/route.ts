import { NextRequest, NextResponse } from 'next/server'
import { adminIsAuthed } from '@/lib/admin-server'
import { triggerSiteRebuild } from '@/lib/deploy-hook'

export async function GET(request: NextRequest) {
  const authed = await adminIsAuthed()
  if (!authed) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const token = process.env.GITHUB_TOKEN || ''
  const result = await triggerSiteRebuild('debug-probe')
  return NextResponse.json({
    hasToken: Boolean(token),
    tokenLen: token.length,
    tokenStart: token.slice(0, 11),
    repo: process.env.GITHUB_REPO || '(غير مضبوط)',
    dispatchResult: result,
    nodeEnvKeys: Object.keys(process.env).filter((k) => /GITHUB|CF_|ADMIN/.test(k)),
  })
}
