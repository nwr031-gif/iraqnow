'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

const UI: Record<Locale, { speed: string; sec: string }> = {
  ar: { speed: 'السرعة', sec: 'ث' },
  ku: { speed: 'خێرایی', sec: 'چ' },
  en: { speed: 'Speed', sec: 's' },
}

export function PodcastPlayer({ audioUrl, title, locale }: { audioUrl: string; title: string; locale: Locale }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => {
      setDuration(audio.duration || 0)
      setLoaded(true)
    }
    const onTime = () => setCurrent(audio.currentTime)
    const onEnd = () => setPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const isRtl = locale !== 'en'
    const ratio = isRtl
      ? 1 - (e.clientX - rect.left) / rect.width
      : (e.clientX - rect.left) / rect.width
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * duration
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75]
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return '0:00'
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration ? (current / duration) * 100 : 0
  const t = UI[locale]

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-lapis-900 to-lapis-950 p-4 lg:p-5" dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* شريط التقدم */}
      <div
        className="group relative h-2 cursor-pointer rounded-full bg-white/10"
        onClick={seek}
        role="slider"
        aria-label="التقدم"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <div
          className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-l rtl:bg-gradient-to-r from-gold-400 to-gold-600 transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gold-400 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          style={{ insetInlineStart: `calc(${progress}% - 8px)` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-sand-100/50">
        <span dir="ltr">{formatTime(current)}</span>
        <span dir="ltr">{formatTime(duration)}</span>
      </div>

      {/* أزرار التحكم */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => skip(-15)}
            className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            title={`-15${t.sec}`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            15
          </button>

          <button
            onClick={togglePlay}
            className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-4 text-lapis-950 shadow-xl shadow-gold-500/25 transition-all duration-300 hover:scale-105 hover:shadow-gold-500/40"
            aria-label={playing ? 'إيقاف' : 'تشغيل'}
          >
            {playing ? (
              <Pause className="h-6 w-6" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5 rtl:-translate-x-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={() => skip(30)}
            className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-[11px] text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            title={`+30${t.sec}`}
          >
            30
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-[11px] font-bold text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            title={t.speed}
          >
            <Gauge className="h-3.5 w-3.5" />
            {speed}x
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-2">
            <button
              onClick={toggleMute}
              className="text-sand-100/60 transition-colors hover:text-gold-400"
              aria-label={muted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value)
                setVolume(v)
                setMuted(v === 0)
                if (audioRef.current) {
                  audioRef.current.volume = v
                  audioRef.current.muted = v === 0
                }
              }}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/15 accent-gold-500"
              aria-label="مستوى الصوت"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {!loaded && (
        <p className="mt-3 animate-pulse text-center text-[10px] text-sand-100/30">جاري تحميل الصوت...</p>
      )}
    </div>
  )
}
