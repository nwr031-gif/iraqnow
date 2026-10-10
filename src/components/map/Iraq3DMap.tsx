'use client'

import dynamic from 'next/dynamic'
import type { Iraq3DMapProps } from './Iraq3DMapCanvas'

const MapCanvas = dynamic(() => import('./Iraq3DMapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex w-full items-center justify-center rounded-3xl border border-gold-500/20 bg-lapis-950" style={{ height: 560 }}>
      <div className="flex flex-col items-center gap-4">
        <span className="animate-float text-5xl">🇮🇶</span>
        <p className="animate-pulse text-xs tracking-[3px] text-gold-400/70">LOADING IRAQ 3D...</p>
      </div>
    </div>
  ),
})

export function Iraq3DMap({ locale, height = 560, showPanel = true }: Iraq3DMapProps) {
  return <MapCanvas locale={locale} height={height} showPanel={showPanel} />
}
