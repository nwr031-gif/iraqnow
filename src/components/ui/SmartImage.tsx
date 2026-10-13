'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * صورة ذكية — عند فشل التحميل (حظر جغرافي/انقطاع) تستبدل نفسها ببديل موثوق
 * ثم تختبئ بلطف إن فشل البديل أيضاً.
 */
export function SmartImage({
  src,
  fallback,
  alt,
  className,
  eager = false,
}: {
  src: string
  fallback?: string
  alt?: string
  className?: string
  eager?: boolean
}) {
  const [stage, setStage] = useState(0)
  const url = stage === 0 ? src : stage === 1 ? fallback : null

  if (!url) {
    return <div className={cn(className, 'bg-cream-deep')} aria-hidden="true" />
  }

  return (
    <img
      src={url}
      alt={alt || ''}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setStage((s) => s + 1)}
    />
  )
}
