import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'سجل دخولك للوصول إلى ميزات مخصصة',
}

export default function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as 'ar' | 'ku' | 'en'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <SignInForm locale={locale} />
    </div>
  )
}