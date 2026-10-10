'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

export interface Iraq3DMapProps {
  locale: Locale
  height?: number
  showPanel?: boolean
}

interface GovMarker {
  slug: string
  ar: string
  ku: string
  en: string
  lon: number
  lat: number
  articles: number
  hot?: boolean
}

/* ═══════════ المحافظات الـ 19 ═══════════ */
export const GOVERNORATES_19: GovMarker[] = [
  { slug: 'baghdad', ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad', lon: 44.36, lat: 33.31, articles: 1240, hot: true },
  { slug: 'basra', ar: 'البصرة', ku: 'بەسرە', en: 'Basra', lon: 47.78, lat: 30.51, articles: 456, hot: true },
  { slug: 'mosul', ar: 'نينوى', ku: 'نەینەوا', en: 'Nineveh', lon: 43.12, lat: 36.34, articles: 342 },
  { slug: 'erbil', ar: 'أربيل', ku: 'هەولێر', en: 'Erbil', lon: 44.01, lat: 36.19, articles: 428, hot: true },
  { slug: 'sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah', lon: 45.43, lat: 35.56, articles: 289 },
  { slug: 'duhok', ar: 'دهوك', ku: 'دهۆک', en: 'Duhok', lon: 42.99, lat: 36.87, articles: 156 },
  { slug: 'halabja', ar: 'حلبجة', ku: 'هەڵەبجە', en: 'Halabja', lon: 45.99, lat: 35.18, articles: 87 },
  { slug: 'najaf', ar: 'النجف', ku: 'نەجەف', en: 'Najaf', lon: 44.01, lat: 32.0, articles: 312 },
  { slug: 'karbala', ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala', lon: 44.02, lat: 32.62, articles: 234 },
  { slug: 'anbar', ar: 'الأنبار', ku: 'ئەنبار', en: 'Anbar', lon: 41.25, lat: 33.42, articles: 198 },
  { slug: 'diyala', ar: 'ديالى', ku: 'دیالە', en: 'Diyala', lon: 45.15, lat: 33.75, articles: 134 },
  { slug: 'kirkuk', ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk', lon: 44.39, lat: 35.47, articles: 267 },
  { slug: 'salahuddin', ar: 'صلاح الدين', ku: 'سەڵاحەدین', en: 'Salahuddin', lon: 43.58, lat: 34.45, articles: 178 },
  { slug: 'babylon', ar: 'بابل', ku: 'بابل', en: 'Babylon', lon: 44.42, lat: 32.54, articles: 145 },
  { slug: 'wasit', ar: 'واسط', ku: 'واسیت', en: 'Wasit', lon: 45.82, lat: 32.31, articles: 121 },
  { slug: 'maysan', ar: 'ميسان', ku: 'مێسان', en: 'Maysan', lon: 47.15, lat: 31.8, articles: 96 },
  { slug: 'dhi-qar', ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar', lon: 46.26, lat: 31.05, articles: 221 },
  { slug: 'muthanna', ar: 'المثنى', ku: 'موسەننا', en: 'Muthanna', lon: 45.3, lat: 30.5, articles: 78 },
  { slug: 'qadisiya', ar: 'القادسية', ku: 'قادسیە', en: 'Qadisiya', lon: 44.93, lat: 31.99, articles: 132 },
]

/* حدود العراق — مبسطة جغرافياً */
const IRAQ_BOUNDARY: [number, number][] = [
  [45.42, 35.98], [46.08, 35.68], [46.15, 35.09], [45.65, 34.75], [45.42, 33.97],
  [46.11, 33.02], [47.33, 32.47], [47.85, 31.71], [47.69, 30.98], [48.0, 30.99],
  [48.01, 30.45], [48.57, 29.93], [47.97, 29.98], [47.3, 30.06], [46.57, 29.1],
  [44.71, 29.18], [41.89, 31.19], [40.4, 31.89], [39.2, 32.16], [38.79, 33.38],
  [41.01, 34.42], [41.38, 35.63], [41.29, 36.36], [41.84, 36.61], [42.35, 37.23],
  [42.78, 37.39], [43.94, 37.26], [44.29, 37.0], [44.77, 37.17], [45.42, 35.98],
]

const UI: Record<Locale, any> = {
  ar: {
    title: 'العراق — 3D', sub: 'IRAQ NOW · 3D MAP', capital: 'العاصمة', govs: 'محافظة', lang: 'لغات', live: 'بث حي',
    reset: 'إعادة', top: 'علوي', side: 'جانبي', rotate: 'دوران', loading: 'جاري تحميل الخريطة 3D...',
    explore: 'انقر على أي محافظة لاستكشاف أخبارها', area: 'المساحة', areaVal: '438,317 كم²',
    click: 'اضغط للتصفح', drag: 'اسحب للتدوير', scroll: 'عجلة الفأرة للتكبير',
  },
  ku: {
    title: 'عێراق — 3D', sub: 'IRAQ NOW · 3D MAP', capital: 'پایتەخت', govs: 'پارێزگا', lang: 'زمان', live: 'پەخش',
    reset: 'گەڕانەوە', top: 'سەرەوە', side: 'لا', rotate: 'سووڕان', loading: 'بارکردنی نەخشەی 3D...',
    explore: 'کرتە لەسەر هەر پارێزگایەک بکە بۆ هەواڵەکانی', area: 'ڕووبەر', areaVal: '438,317 کم²',
    click: 'کرتە بۆ گەڕان', drag: 'ڕاکێشان بۆ سووڕان', scroll: 'چەرخە بۆ نزیککردنەوە',
  },
  en: {
    title: 'Iraq — 3D', sub: 'IRAQ NOW · 3D MAP', capital: 'Capital', govs: 'Governorates', lang: 'Languages', live: 'LIVE',
    reset: 'Reset', top: 'Top', side: 'Side', rotate: 'Rotate', loading: 'Loading 3D map...',
    explore: 'Click any governorate to explore its news', area: 'Area', areaVal: '438,317 km²',
    click: 'Click to browse', drag: 'Drag to rotate', scroll: 'Scroll to zoom',
  },
}

function project(lon: number, lat: number): { x: number; y: number } {
  const scale = 1.05
  return { x: (lon - 43.5) * scale, y: (lat - 33.5) * scale }
}

export default function Iraq3DMapCanvas({ locale, height = 560, showPanel = true }: Iraq3DMapProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState<{ name: string; articles: number; x: number; y: number } | null>(null)

  const stateRef = useRef<{
    renderer?: THREE.WebGLRenderer
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    group?: THREE.Group
    markers?: THREE.Mesh[]
    raycaster?: THREE.Raycaster
    pointer?: THREE.Vector2
    raf?: number
    autoRotate: boolean
    mouseDown: boolean
    dragging: boolean
    prev: { x: number; y: number }
    targetRotX: number
    targetRotY: number
    curRotX: number
    curRotY: number
    camDist: number
  }>({ autoRotate: true, mouseDown: false, dragging: false, prev: { x: 0, y: 0 }, targetRotX: -0.55, targetRotY: 0, curRotX: -0.55, curRotY: 0, camDist: 15 })

  const t = UI[locale]

  /* ═══════════ التهيئة ═══════════ */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const s = stateRef.current
    let disposed = false

    /* المشهد */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 5.5, s.camDist)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    /* الإضاءة */
    scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x050a18, 2.2))
    const key = new THREE.DirectionalLight(0xe8d9a8, 3.6)
    key.position.set(-5, 10, 7)
    scene.add(key)
    const rim = new THREE.PointLight(0xd4af37, 16, 30)
    rim.position.set(5, 3, -4)
    scene.add(rim)

    /* المجموعة الدوارة */
    const group = new THREE.Group()
    scene.add(group)

    /* شكل العراق */
    const shape = new THREE.Shape()
    IRAQ_BOUNDARY.forEach(([lon, lat], i) => {
      const p = project(lon, lat)
      if (i === 0) shape.moveTo(p.x, p.y)
      else shape.lineTo(p.x, p.y)
    })
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.65, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.05, bevelThickness: 0.05, curveSegments: 2,
    })
    geometry.center()

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1e4a8c, metalness: 0.35, roughness: 0.25,
      clearcoat: 1, clearcoatRoughness: 0.2, emissive: 0x081a38, emissiveIntensity: 0.45,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)

    /* الحدود الذهبية */
    const edges = new THREE.EdgesGeometry(geometry, 15)
    const goldEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.85 }))
    group.add(goldEdges)
    const glowEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.25 }))
    glowEdges.scale.set(1.012, 1.012, 1.012)
    group.add(glowEdges)

    /* علامات المحافظات الـ19 */
    const markers: THREE.Mesh[] = []
    GOVERNORATES_19.forEach((gov) => {
      const p = project(gov.lon, gov.lat)
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(gov.hot ? 0.065 : 0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: gov.hot ? 0xffd966 : 0xf4dd97 })
      )
      marker.position.set(p.x, p.y, 0.42)
      marker.userData = { slug: gov.slug, name: gov[locale], articles: gov.articles }
      group.add(marker)
      markers.push(marker)

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(gov.hot ? 0.15 : 0.11, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.16 })
      )
      glow.position.copy(marker.position)
      group.add(glow)
    })

    /* الشبكة والأرضية */
    const grid = new THREE.GridHelper(35, 35, 0x1e4a8c, 0x0f2140)
    grid.position.y = -3
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.22
    scene.add(grid)
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(45, 45),
      new THREE.MeshStandardMaterial({ color: 0x060d1f, roughness: 0.9 })
    )
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -3.05
    scene.add(plane)

    /* تفاعلات */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const getPos = (e: PointerEvent | WheelEvent) => {
      const rect = container.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onPointerDown = (e: PointerEvent) => {
      s.mouseDown = true
      s.dragging = false
      s.prev = getPos(e)
      container.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      const pos = getPos(e)
      if (s.mouseDown) {
        const dx = pos.x - s.prev.x
        const dy = pos.y - s.prev.y
        if (Math.abs(dx) + Math.abs(dy) > 3) s.dragging = true
        s.targetRotY += dx * 0.006
        s.targetRotX += dy * 0.004
        s.targetRotX = Math.max(-1.5, Math.min(0.2, s.targetRotX))
        s.prev = pos
        setHovered(null)
        return
      }
      /* hover */
      pointer.x = (pos.x / container.clientWidth) * 2 - 1
      pointer.y = -(pos.y / container.clientHeight) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(markers, false)
      if (hits.length > 0) {
        const m = hits[0].object as THREE.Mesh
        const ud = m.userData as any
        setHovered({ name: ud.name, articles: ud.articles, x: pos.x, y: pos.y })
        container.style.cursor = 'pointer'
      } else {
        setHovered(null)
        container.style.cursor = 'grab'
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (s.mouseDown && !s.dragging) {
        const pos = getPos(e)
        pointer.x = (pos.x / container.clientWidth) * 2 - 1
        pointer.y = -(pos.y / container.clientHeight) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(markers, false)
        if (hits.length > 0) {
          const slug = (hits[0].object as THREE.Mesh).userData.slug as string
          router.push(`/${locale}/governorate/${slug}`)
        }
      }
      s.mouseDown = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      s.camDist = Math.max(7, Math.min(30, s.camDist + e.deltaY * 0.008))
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointerleave', () => { s.mouseDown = false; setHovered(null) })
    container.addEventListener('wheel', onWheel, { passive: false })

    const onResize2 = () => {
      if (!container.clientWidth) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    const ro = new ResizeObserver(onResize2)
    ro.observe(container)

    /* حلقة الرسم */
    const clock = new THREE.Clock()
    const animate = () => {
      if (disposed) return
      const raf = requestAnimationFrame(animate)
      s.raf = raf

      const time = clock.getElapsedTime()
      if (s.autoRotate && !s.mouseDown) s.targetRotY += 0.0015

      s.curRotX += (s.targetRotX - s.curRotX) * 0.08
      s.curRotY += (s.targetRotY - s.curRotY) * 0.08
      group.rotation.x = s.curRotX
      group.rotation.y = s.curRotY

      camera.position.x = Math.sin(s.curRotY * 0.25) * s.camDist * 0.35
      camera.position.z = Math.cos(s.curRotY * 0.25) * s.camDist
      camera.position.y = 5.5
      camera.lookAt(0, 0, 0)

      /* نبض العلامات الساخنة */
      markers.forEach((m, i) => {
        if (i % 4 === 0) m.position.z = 0.42 + Math.sin(time * 2 + i) * 0.04
      })

      renderer.render(scene, camera)
    }
    animate()
    setReady(true)

    return () => {
      disposed = true
      if (s.raf) cancelAnimationFrame(s.raf)
      ro.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('wheel', onWheel)
      geometry.dispose()
      material.dispose()
      edges.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  /* أزرار الكاميرا */
  const setView = useCallback((view: 'reset' | 'top' | 'side') => {
    const s = stateRef.current
    if (view === 'reset') { s.targetRotX = -0.55; s.targetRotY = 0; s.camDist = 15 }
    if (view === 'top') s.targetRotX = -1.48
    if (view === 'side') s.targetRotX = -0.15
  }, [])

  const toggleRotate = useCallback(() => {
    stateRef.current.autoRotate = !stateRef.current.autoRotate
  }, [])

  const govName = (g: GovMarker) => g[locale]

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-gold-500/20 bg-lapis-950" style={{ height }}>
      {/* الخلفية */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 45%, #12294f 0%, #0a1834 40%, #050b1c 75%, #02060f 100%)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />

      {/* لوحة 3D */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab touch-none" role="application" aria-label="خريطة العراق ثلاثية الأبعاد" />

      {/* الشريط العلوي */}
      <div className="pointer-events-none absolute start-4 top-4 z-10 flex items-center gap-3 rounded-2xl border border-gold-500/25 bg-lapis-950/75 px-4 py-2.5 backdrop-blur-xl">
        <span className="text-2xl">🇮🇶</span>
        <div>
          <p className="font-kufi text-sm font-bold text-white">{t.title}</p>
          <p className="text-[9px] tracking-[3px] text-gold-400/70">{t.sub}</p>
        </div>
      </div>

      {/* لوحة الإحصائيات */}
      {showPanel && (
        <div className="pointer-events-none absolute end-4 top-4 z-10 hidden w-52 rounded-2xl border border-gold-500/20 bg-lapis-950/70 p-4 backdrop-blur-xl sm:block">
          <h3 className="mb-3 font-kufi text-xs font-bold text-gold-400">{t.title}</h3>
          {[
            [t.capital, locale === 'en' ? 'Baghdad' : 'بغداد'],
            [t.govs, '19'],
            [t.area, t.areaVal],
            [t.lang, '3'],
          ].map(([k, v], i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/[0.06] py-1.5 text-[11px] last:border-0">
              <span className="text-sand-100/50">{k}</span>
              <span className="font-bold text-gold-300">{v}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-green-500/15 py-1 text-[10px] font-bold text-green-400">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative h-1.5 w-1.5 rounded-full bg-green-500" /></span>
            {t.live}
          </div>
        </div>
      )}

      {/* التسمية العائمة */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-gold-500/30 bg-lapis-950/90 px-3.5 py-2 backdrop-blur-md"
          style={{ left: hovered.x + 14, top: hovered.y - 10 }}
        >
          <p className="font-kufi text-xs font-bold text-white">{hovered.name}</p>
          <p className="text-[10px] text-gold-400">{hovered.articles.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {locale === 'en' ? 'articles' : 'خبر'}</p>
          <p className="text-[9px] text-sand-100/40">{t.click} →</p>
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="absolute bottom-4 start-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-2xl border border-gold-500/20 bg-lapis-950/80 p-1.5 backdrop-blur-xl rtl:translate-x-1/2">
        {[
          { label: t.reset, action: () => setView('reset') },
          { label: t.top, action: () => setView('top') },
          { label: t.side, action: () => setView('side') },
          { label: t.rotate, action: toggleRotate },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="rounded-xl bg-white/[0.06] px-3.5 py-2 text-[11px] font-medium text-sand-100/80 transition-all duration-300 hover:bg-gold-500/20 hover:text-gold-300 sm:px-4"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* تلميح سفلي */}
      <p className="pointer-events-none absolute bottom-4 end-4 z-10 hidden text-[10px] text-sand-100/35 lg:block">
        {t.drag} · {t.scroll}
      </p>

      {/* شاشة التحميل */}
      {!ready && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-lapis-950/95">
          <span className="animate-float text-5xl">🇮🇶</span>
          <p className="animate-pulse text-xs tracking-[3px] text-gold-400/70">{t.loading}</p>
        </div>
      )}

      {/* فهرس المحافظات */}
      <div className="pointer-events-none absolute inset-x-4 bottom-16 z-10 hidden justify-center gap-1 overflow-hidden lg:flex">
        <div className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto scrollbar-hide rounded-xl bg-lapis-950/60 px-2 py-1.5 backdrop-blur-md">
          {GOVERNORATES_19.slice(0, 12).map((g) => (
            <button
              key={g.slug}
              onClick={() => router.push(`/${locale}/governorate/${g.slug}`)}
              className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium text-sand-100/60 transition-colors hover:bg-gold-500/15 hover:text-gold-300"
            >
              {govName(g)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
