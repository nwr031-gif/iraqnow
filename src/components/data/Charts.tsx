'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

/* ═══════════ رسم أعمدة تفاعلي ═══════════ */
export function BarChart({
  data,
  labels,
  color = '#d4af37',
  height = 220,
}: {
  data: number[]
  labels: string[]
  color?: string
  height?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data, 1)

  return (
    <div className="w-full" dir="rtl">
      <div className="flex items-end justify-between gap-1.5" style={{ height }}>
        {data.map((v, i) => (
          <div
            key={i}
            className="group relative flex flex-1 flex-col items-center justify-end gap-2"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <span className="absolute -top-8 z-10 rounded-lg bg-lapis-950 px-2.5 py-1 text-[10px] font-bold text-gold-400 shadow-lg">
                {v.toLocaleString('ar-IQ')}
              </span>
            )}
            <div
              className={cn(
                'w-full rounded-t-lg transition-all duration-300',
                hover === i ? 'brightness-125' : ''
              )}
              style={{
                height: `${(v / max) * (height - 40)}px`,
                background: `linear-gradient(to top, ${color}55, ${color})`,
              }}
            />
            <span className="text-[9px] text-[var(--muted)]">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════ رسم خطي تفاعلي ═══════════ */
export function LineChart({
  data,
  labels,
  color = '#4a80c9',
  height = 200,
}: {
  data: number[]
  labels: string[]
  color?: string
  height?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const w = 100 // نسبة مئوية
  const points = useMemo(
    () =>
      data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: 100 - ((v - min) / range) * 80 - 10,
      })),
    [data, min, range]
  )

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${path} L${w},100 L0,100 Z`

  return (
    <div className="w-full" dir="rtl">
      <div className="relative" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#lineGrad)" />
          <path d={path} fill="none" stroke={color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hover === i ? 1.6 : 0.9}
              fill={color}
              stroke={hover === i ? '#fff' : 'none'}
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-lapis-950 px-2.5 py-1 text-[10px] font-bold text-gold-400 shadow-lg"
            style={{ left: `${points[hover].x}%`, top: `${points[hover].y}%`, transform: 'translate(-50%, -130%)' }}
          >
            {data[hover].toLocaleString('ar-IQ')} · {labels[hover]}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[9px] text-[var(--muted)]">
        <span>{labels[0]}</span>
        <span>{labels[Math.floor(labels.length / 2)]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  )
}

/* ═══════════ رسم دائري (Donut) ═══════════ */
export function DonutChart({
  segments,
  size = 180,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[]
  size?: number
  centerLabel?: string
  centerValue?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const total = segments.reduce((s, x) => s + x.value, 0)
  const radius = 42
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const arcs = segments.map((seg, i) => {
    const frac = seg.value / total
    const dash = frac * circumference
    const arc = { ...seg, dash, offset: -offset, idx: i }
    offset += dash
    return arc
  })

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8" dir="rtl">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {arcs.map((arc) => (
            <circle
              key={arc.idx}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={active === arc.idx ? 13 : 10}
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={arc.offset}
              onMouseEnter={() => setActive(arc.idx)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: 'pointer', transition: 'stroke-width .25s' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-kufi text-xl font-bold text-[var(--foreground)]">
            {active !== null ? `${Math.round((segments[active].value / total) * 100)}%` : centerValue}
          </span>
          <span className="mt-0.5 text-[10px] text-[var(--muted)]">
            {active !== null ? segments[active].label : centerLabel}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {segments.map((seg, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2 py-1 text-xs transition-colors',
              active === i ? 'bg-gold-500/10' : ''
            )}
          >
            <span className="h-3 w-3 rounded-sm" style={{ background: seg.color }} />
            <span className="text-[var(--foreground)]">{seg.label}</span>
            <span className="font-bold text-[var(--muted)]">
              {Math.round((seg.value / total) * 100)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
