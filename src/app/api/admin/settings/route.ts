import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { saveSettings, loadSettings } from '@/lib/content-service'

export async function GET() {
  const perm = await requirePermission('dashboard.view')
  if (isErrorResponse(perm)) return perm
  return NextResponse.json({ settings: loadSettings() })
}

export async function PATCH(request: NextRequest) {
  const perm = await requirePermission('settings.manage')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    const result = await saveSettings(body)
    return NextResponse.json({ success: true, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
