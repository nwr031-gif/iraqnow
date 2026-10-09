'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

const signInSchema = z.object({
  email: z.string().email({ message: 'بريد إلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  remember: z.boolean().optional(),
})

type SignInFormData = z.infer<typeof signInSchema>

const texts = {
  ar: { title: 'تسجيل الدخول', subtitle: 'أدخل بياناتك للوصول لحسابك', email: 'البريد الإلكتروني', password: 'كلمة المرور', remember: 'تذكرني', forgot: 'نسيت كلمة المرور؟', submit: 'دخول', loading: 'جاري الدخول...', noAccount: 'لا تملك حساب؟', signup: 'إنشاء حساب', or: 'أو', google: 'Google', facebook: 'Facebook', success: 'تم تسجيل الدخول بنجاح', error: 'بريد إلكتروني أو كلمة مرور غير صحيحة', redirecting: 'جاري التوجيه...' },
  ku: { title: 'چوونەژوورەوە', subtitle: 'داتای خۆت بنووسە بۆ دەستپێکردن بە Hesابکەت', email: 'ئیمەیڵ', password: 'وشەی نهێنی', remember: 'لێبکەوە', forgot: 'وشەی نهێنی لەبیرچووە؟', submit: 'چوونەژوورەوە', loading: 'چوونەژوورەوە...', noAccount: 'حسابیت نیە؟', signup: 'دروست کردنی حساب', or: 'یان', google: 'Google', facebook: 'Facebook', success: 'بە سەرکەوتوویی چوویتە ژوورەوە', error: 'ئیمەیڵ یان وشەی نهێنی هەڵەیە', redirecting: 'ڕێکخستن...' },
  en: { title: 'Sign In', subtitle: 'Enter your credentials to access your account', email: 'Email', password: 'Password', remember: 'Remember me', forgot: 'Forgot password?', submit: 'Sign In', loading: 'Signing in...', noAccount: 'Don\'t have an account?', signup: 'Create Account', or: 'or', google: 'Google', facebook: 'Facebook', success: 'Successfully signed in', error: 'Invalid email or password', redirecting: 'Redirecting...' },
}

export function SignInForm({ locale }: { locale: 'ar' | 'ku' | 'en' }) {
  const t = texts[locale]
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { remember: true },
  })

  const onSubmit = async (data: SignInFormData) => {
    setError('')
    setSuccess('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(t.error)
      } else {
        setSuccess(t.success)
        setTimeout(() => router.push(callbackUrl), 1000)
      }
    } catch {
      setError(t.error)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, { callbackUrl })
  }

  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div className="w-full max-w-md" dir={dir}>
      <div className="text-center mb-8">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <span className="text-xl font-bold text-white">IQ</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {(error || success) && (
        <div className={cn('mb-6 p-4 rounded-lg flex items-center gap-3 text-sm', error ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400')}>
          {error ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
          <span>{error || success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">{t.email}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="email"
              type="email"
              {...register('email')}
              className={cn('input pl-10', errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
              placeholder={t.email}
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="label">{t.password}</label>
            <Link href={`/${locale}/auth/forgot-password`} className="text-sm text-accent hover:underline">{t.forgot}</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={cn('input pl-10 pr-10', errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20')}
              placeholder={t.password}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('remember')} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{t.remember}</span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.loading}
            </>
          ) : (
            t.submit
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">{t.or}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isSubmitting}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t.google}
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={isSubmitting}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            {t.facebook}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {t.noAccount}{' '}
        <Link href={`/${locale}/auth/signup`} className="font-medium text-accent hover:underline">
          {t.signup}
        </Link>
      </p>
    </div>
  )
}