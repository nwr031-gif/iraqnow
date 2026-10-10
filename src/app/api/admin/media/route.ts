import { NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'

export async function GET() {
  const perm = await requirePermission('media.manage')
  if (isErrorResponse(perm)) return perm

  /* التخزين المحلي غير متاح على بيئات Edge/Workers — نرجع قائمة فارغة بأمان */
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    const files = await fs.readdir(uploadDir)
    const items = await Promise.all(
      files
        .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
        .map(async (filename) => {
          const stats = await fs.stat(path.join(uploadDir, filename))
          return {
            url: `/uploads/${filename}`,
            filename,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
          }
        })
    )
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ items, total: items.length })
  } catch {
    return NextResponse.json({ items: [], total: 0, cloud: true })
  }
}
