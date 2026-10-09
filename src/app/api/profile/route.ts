import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/rbac'
import { updateUser } from '@/lib/content-service'
import { getAuthorById } from '@/lib/data'

export async function GET() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })

  const author = await getAuthorById(sessionUser.id)
  if (!author) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

  return NextResponse.json({
    profile: {
      id: author.id,
      name: author.name,
      slug: author.slug,
      email: author.email,
      role: author.role,
      avatar: author.avatar || '',
      coverImage: author.coverImage || '',
      jobTitle: author.jobTitle.ar || '',
      bio: author.bio.ar || '',
      twitter: author.twitter || '',
      linkedin: author.linkedin || '',
      instagram: author.instagram || '',
      website: author.website || '',
      specialties: author.specialties,
      staffSince: author.staffSince,
      articleCount: author.articleCount,
    },
  })
}

/**
 * الملف الشخصي للمحرر — يعدّل بياناته الخاصة فقط
 */
export async function PATCH(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })

  try {
    const body = await request.json()

    const data: any = {}
    if (body.name !== undefined) data.name = body.name
    if (body.avatar !== undefined) data.avatar = body.avatar
    if (body.coverImage !== undefined) data.coverImage = body.coverImage
    if (body.jobTitle !== undefined) data.jobTitle = { ar: body.jobTitle, ku: body.jobTitle, en: body.jobTitle }
    if (body.bio !== undefined) data.bio = { ar: body.bio, ku: body.bio, en: body.bio }
    if (body.twitter !== undefined) data.twitter = body.twitter
    if (body.linkedin !== undefined) data.linkedin = body.linkedin
    if (body.instagram !== undefined) data.instagram = body.instagram
    if (body.website !== undefined) data.website = body.website
    if (body.specialties !== undefined) data.specialties = body.specialties
    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
      }
      data.password = body.password
    }

    const result = await updateUser(user.id, data)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
