import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getSessionUser, hasRole } from '@/lib/rbac'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user || !hasRole(user.role, 'JOURNALIST')) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز 5 ميغابايت' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم (JPG, PNG, WebP)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    /* محاولة Supabase Storage أولاً */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isJwtKey = supabaseKey?.startsWith('eyJ')

    if (supabaseUrl && isJwtKey) {
      try {
        const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/media/${filename}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: buffer,
        })
        if (uploadRes.ok) {
          return NextResponse.json({
            url: `${supabaseUrl}/storage/v1/object/public/media/${filename}`,
            filename,
            storage: 'supabase',
          })
        }
      } catch {
        /* fallback للتخزين المحلي */
      }
    }

    /* تخزين محلي */
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}`, filename, storage: 'local' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'فشل رفع الملف' }, { status: 500 })
  }
}
