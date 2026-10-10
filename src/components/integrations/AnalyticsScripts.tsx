'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => Promise<void>>
  }
}

/**
 * سكربتات التحليلات — تُحمّل فقط إذا كانت المفاتيح مضبوطة (env)
 * Cloudflare Web Analytics: NEXT_PUBLIC_CF_ANALYTICS_TOKEN
 * Umami: NEXT_PUBLIC_UMAMI_SRC + NEXT_PUBLIC_UMAMI_ID
 * OneSignal: NEXT_PUBLIC_ONESIGNAL_APP_ID
 */
export function AnalyticsScripts() {
  const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

  useEffect(() => {
    /* OneSignal */
    if (oneSignalAppId && !document.querySelector('script[src*="OneSignalSDK"]')) {
      window.OneSignalDeferred = window.OneSignalDeferred || []
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        await OneSignal.init({ appId: oneSignalAppId })
      })
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
      script.defer = true
      document.head.appendChild(script)
    }
  }, [oneSignalAppId])

  return (
    <>
      {/* Cloudflare Web Analytics */}
      {cfToken && (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cfToken })}
        />
      )}

      {/* Umami Analytics */}
      {umamiSrc && umamiId && (
        <script defer src={umamiSrc} data-website-id={umamiId} />
      )}
    </>
  )
}
