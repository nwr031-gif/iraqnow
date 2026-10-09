import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { requirePermission, isErrorResponse } from '@/lib/rbac'

export async function GET() {
  const perm = await requirePermission('media.manage')
  if (isErrorResponse(perm)) return perm

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) {
    return NextResponse.json({ items: [], total: 0 })
  }

  try {
    const files = await readdir(uploadDir)
    const items = await Promise.all(
      files
        .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
        .map(async (filename) => {
          const stats = await stat(path.join(uploadDir, filename))
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
    return NextResponse.json({ items: [], total: 0 })
  }
}
