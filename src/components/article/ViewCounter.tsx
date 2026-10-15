'use client'

import { useEffect } from 'react'

/**
 * عدّاد المشاهدات — يُطلق مرة واحدة لكل جلسة لكل مقالة (نافذة ساعة)
 * يُرسل إشعاراً خفيفاً بعد الظهور لتجنب عدّ الزيارات المسبقة
 */
export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      if (!slug) return
      const key = `iqn-v:${slug}`
      const last = Number(sessionStorage.getItem(key) || 0)
      if (Date.now() - last < 3600_000) return
      sessionStorage.setItem(key, String(Date.now()))
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {})
    } catch { /* تجاهل */ }
  }, [slug])

  return null
}
