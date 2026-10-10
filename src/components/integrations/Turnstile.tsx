'use client'

import { useEffect, useRef } from 'react'

/**
 * Cloudflare Turnstile — بديل reCAPTCHA المجاني غير المحدود
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY (تحقق خادمي)
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string
      reset: (id?: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    const render = () => {
      if (!containerRef.current || widgetId.current) return
      widgetId.current =
        window.turnstile?.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          language: 'ar',
          callback: (token: string) => onToken(token),
          'expired-callback': () => onToken(''),
        }) || null
    }

    if (window.turnstile) {
      render()
      return
    }

    window.onTurnstileLoad = render
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
      script.async = true
      document.head.appendChild(script)
    }
  }, [siteKey, onToken])

  if (!siteKey) return null

  return <div ref={containerRef} className="my-3 flex justify-center" />
}

/** التحقق الخادمي من توكن Turnstile */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true /* غير مفعّل — تخطَّ التحقق */
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}
