'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Image as ImageIcon, Upload, Trash2, Copy, CheckCircle2, Loader2, Search, Link2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  url: string
  filename: string
  size?: number
  createdAt?: string
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    let success = 0
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) success++
      } catch {
        /* continue */
      }
    }
    setUploading(false)
    if (success > 0) {
      showToast('success', `تم رفع ${success} ملف بنجاح`)
      loadMedia()
    } else {
      showToast('error', 'فشل رفع الملفات')
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
    showToast('success', 'تم نسخ الرابط')
  }

  const filtered = items.filter((i) => !search || i.filename.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn(
          'fixed bottom-6 start-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl animate-fade-up',
          toast.type === 'success' ? 'border-green-500/30 bg-green-950/95 text-green-300' : 'border-red-500/30 bg-red-950/95 text-red-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircleIcon />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-kufi text-2xl font-bold text-white">مكتبة الوسائط</h1>
          <p className="mt-1 text-sm text-sand-100/50">{items.length} ملف — الصور المرفوعة للمقالات والمحتوى</p>
        </div>
        <label className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi cursor-pointer">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'جاري الرفع...' : 'رفع صور'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
        </label>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-100/30" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث في الملفات..."
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 pe-4 ps-10 text-sm text-sand-100 placeholder:text-sand-100/30 focus:border-gold-500/50 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
          <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
          جاري التحميل...
        </div>
      ) : filtered.length === 0 ? (
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 transition-colors hover:border-gold-500/40 hover:bg-gold-500/[0.03]">
          <ImageIcon className="h-12 w-12 text-sand-100/20" />
          <p className="text-sm text-sand-100/50">لا توجد ملفات بعد — اضغط لرفع أول صورة</p>
          <span className="text-[11px] text-sand-100/30">JPG, PNG, WebP — حتى 5MB للملف</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        </label>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.url} className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              <div className="relative aspect-video overflow-hidden">
                <img src={item.url} alt={item.filename} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="rounded-lg bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-lapis-950"
                    title="نسخ الرابط"
                  >
                    {copied === item.url ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-lapis-950"
                    title="عرض"
                  >
                    <Link2 className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <p className="truncate px-3 py-2 text-[10px] text-sand-100/50" dir="ltr">
                {item.filename}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AlertCircleIcon() {
  return <span className="h-4 w-4 text-red-400">!</span>
}
