'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import { GOVERNORATES_19, type GovMarker } from '@/lib/governorates'

type Locale = 'ar' | 'ku' | 'en'

export interface Iraq3DMapProps {
  locale: Locale
  height?: number
  showPanel?: boolean
  counts?: Record<string, number> | null
}

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
    area: 'المساحة', areaVal: '438,317 كم²',
    click: 'اضغط للتصفح', drag: 'اسحب للتدوير', scroll: 'عجلة الفأرة للتكبير',
    topGovs: 'الأكثر تغطية', news: 'خبر', legend: 'حجم النقطة = كثافة التغطية', all: 'كل المحافظات',
  },
  ku: {
    title: 'عێراق — 3D', sub: 'IRAQ NOW · 3D MAP', capital: 'پایتەخت', govs: 'پارێزگا', lang: 'زمان', live: 'پەخش',
    reset: 'گەڕانەوە', top: 'سەرەوە', side: 'لا', rotate: 'سووڕان', loading: 'بارکردنی نەخشەی 3D...',
    area: 'ڕووبەر', areaVal: '438,317 کم²',
    click: 'کرتە بۆ گەڕان', drag: 'ڕاکێشان بۆ سووڕان', scroll: 'چەرخە بۆ نزیککردنەوە',
    topGovs: 'زۆرترین پەرپێدان', news: 'هەواڵ', legend: 'قەبارەی خاڵ = چڕی پەرپێدان', all: 'هەموو پارێزگاکان',
  },
  en: {
    title: 'Iraq — 3D', sub: 'IRAQ NOW · 3D MAP', capital: 'Capital', govs: 'Governorates', lang: 'Languages', live: 'LIVE',
    reset: 'Reset', top: 'Top', side: 'Side', rotate: 'Rotate', loading: 'Loading 3D map...',
    area: 'Area', areaVal: '438,317 km²',
    click: 'Click to browse', drag: 'Drag to rotate', scroll: 'Scroll to zoom',
    topGovs: 'Top Coverage', news: 'articles', legend: 'Dot size = coverage volume', all: 'All Governorates',
  },
}

function project(lon: number, lat: number): { x: number; y: number } {
  const scale = 1.05
  return { x: (lon - 43.5) * scale, y: (lat - 33.5) * scale }
}

/* ═══════════ لوحات الألوان الأحادية — حسب الوضع ═══════════ */
function palette(isDark: boolean) {
  return isDark
    ? {
        land: 0x1f1f1f,
        landMetal: 0.3, landRough: 0.3,
        edgeColor: 0xffffff, edgeOpacity: 0.9, glowOpacity: 0.18,
        marker: 0xffffff, markerGlow: 0xffffff, markerGlowOpacity: 0.18,
        markerHover: 0xffffff,
        hemiSky: 0xffffff, hemiGround: 0x1a1a1a, hemiInt: 1.4,
        dirInt: 2.4,
        grid1: 0x2e2e2e, grid2: 0x1c1c1c, gridOpacity: 0.35,
        plane: 0x0d0d0d,
        bg: 'radial-gradient(circle at 50% 42%, #1d1d1d 0%, #141414 45%, #0c0c0c 74%, #060606 100%)',
      }
    : {
        land: 0xececec,
        landMetal: 0.08, landRough: 0.45,
        edgeColor: 0x0a0a0a, edgeOpacity: 0.85, glowOpacity: 0.12,
        marker: 0x0a0a0a, markerGlow: 0x0a0a0a, markerGlowOpacity: 0.12,
        markerHover: 0x0a0a0a,
        hemiSky: 0xffffff, hemiGround: 0xcfcfcf, hemiInt: 1.6,
        dirInt: 2.2,
        grid1: 0xd0d0d0, grid2: 0xc4c4c4, gridOpacity: 0.4,
        plane: 0xe6e6e6,
        bg: 'radial-gradient(circle at 50% 42%, #ffffff 0%, #f7f7f7 45%, #efefef 74%, #e8e8e8 100%)',
      }
}

export default function Iraq3DMapCanvas({ locale, height = 560, showPanel = true, counts = null }: Iraq3DMapProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [vh, setVh] = useState(height)
  const [hovered, setHovered] = useState<{ name: string; articles: number; x: number; y: number } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  /* ارتفاع متجاوب — أصغر على الهاتف */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const apply = () => setVh(mq.matches ? Math.min(height, 460) : height)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [height])

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
    visible: boolean
  }>({ autoRotate: true, mouseDown: false, dragging: false, prev: { x: 0, y: 0 }, targetRotX: -0.55, targetRotY: 0, curRotX: -0.55, curRotY: 0, camDist: 15, visible: true })

  const t = UI[locale]

  /* مراقبة الوضع الليلي */
  useEffect(() => {
    const el = document.documentElement
    setIsDark(el.classList.contains('dark'))
    const obs = new MutationObserver(() => setIsDark(el.classList.contains('dark')))
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  /* الأعداد الحقيقية + الأكثر تغطية */
  const realCounts = counts || null
  const articleCount = useCallback(
    (g: GovMarker) => (realCounts ? (realCounts[g.slug] || 0) : g.articles),
    [realCounts]
  )
  const maxCount = Math.max(1, ...GOVERNORATES_19.map((g) => articleCount(g)))
  const topGovs = [...GOVERNORATES_19].sort((a, b) => articleCount(b) - articleCount(a)).slice(0, 5)

  /* ═══════════ التهيئة ═══════════ */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const s = stateRef.current
    const P = palette(isDark)
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

    /* الإضاءة — محايدة */
    scene.add(new THREE.HemisphereLight(P.hemiSky, P.hemiGround, P.hemiInt))
    const key = new THREE.DirectionalLight(0xffffff, P.dirInt)
    key.position.set(-5, 10, 7)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, P.dirInt * 0.25)
    fill.position.set(6, 4, -6)
    scene.add(fill)

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
      color: P.land, metalness: P.landMetal, roughness: P.landRough,
      clearcoat: 0.6, clearcoatRoughness: 0.25,
      emissive: isDark ? 0x000000 : 0x000000, emissiveIntensity: 0,
    })
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)

    /* الحدود — خط نظيف */
    const edges = new THREE.EdgesGeometry(geometry, 15)
    const strokeEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: P.edgeColor, transparent: true, opacity: P.edgeOpacity }))
    group.add(strokeEdges)
    const glowEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: P.edgeColor, transparent: true, opacity: P.glowOpacity }))
    glowEdges.scale.set(1.012, 1.012, 1.012)
    group.add(glowEdges)

    /* علامات المحافظات الـ19 — الحجم حسب الكثافة */
    const markers: THREE.Mesh[] = []
    const hotSlugs = new Set(topGovs.filter((g) => articleCount(g) > 0).slice(0, 3).map((g) => g.slug))
    GOVERNORATES_19.forEach((gov) => {
      const c = articleCount(gov)
      const tNorm = Math.min(1, c / maxCount)
      const baseR = 0.035 + tNorm * 0.055
      const isHot = hotSlugs.has(gov.slug)

      const p = project(gov.lon, gov.lat)
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(baseR, 20, 20),
        new THREE.MeshBasicMaterial({ color: P.marker })
      )
      marker.position.set(p.x, p.y, 0.42 + (isHot ? 0.02 : 0))
      marker.userData = { slug: gov.slug, name: gov[locale], articles: c, baseR, isHot }
      group.add(marker)
      markers.push(marker)

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(baseR * 2.6, 16, 16),
        new THREE.MeshBasicMaterial({ color: P.markerGlow, transparent: true, opacity: P.markerGlowOpacity * (isHot ? 1.5 : 1) })
      )
      glow.position.copy(marker.position)
      glow.userData = { isGlow: true, parentSlug: gov.slug }
      group.add(glow)
    })

    /* الشبكة والأرضية */
    const grid = new THREE.GridHelper(35, 35, P.grid1, P.grid2)
    grid.position.y = -3
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = P.gridOpacity
    scene.add(grid)
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(45, 45),
      new THREE.MeshStandardMaterial({ color: P.plane, roughness: 0.95 })
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
          setSelected(slug)
          router.push(`/${locale}/governorate/${slug}`)
        }
      }
      s.mouseDown = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      s.camDist = Math.max(7, Math.min(30, s.camDist + e.deltaY * 0.008))
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        s.targetRotX = -0.55
        s.targetRotY = 0
        s.camDist = 15
      }
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointerleave', () => { s.mouseDown = false; setHovered(null) })
    container.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)

    const onResize2 = () => {
      if (!container.clientWidth) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    const ro = new ResizeObserver(onResize2)
    ro.observe(container)

    /* إيقاف الرسم خارج الشاشة — أداء أفضل */
    const io = new IntersectionObserver((entries) => {
      s.visible = entries[0]?.isIntersecting ?? true
    }, { threshold: 0.05 })
    io.observe(container)

    /* حلقة الرسم */
    const clock = new THREE.Clock()
    const animate = () => {
      if (disposed) return
      const raf = requestAnimationFrame(animate)
      s.raf = raf
      if (!s.visible) return

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
        const ud = m.userData as any
        if (ud.isHot) {
          const pulse = 1 + Math.sin(time * 2 + i) * 0.12
          m.scale.setScalar(pulse)
          m.position.z = 0.44 + Math.sin(time * 2 + i) * 0.03
        }
      })

      renderer.render(scene, camera)
    }
    animate()
    setReady(true)

    return () => {
      disposed = true
      if (s.raf) cancelAnimationFrame(s.raf)
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      geometry.dispose()
      material.dispose()
      edges.dispose()
      markers.forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose() })
      renderer.dispose()
      if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, isDark, counts])

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
    <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-[var(--background)]" style={{ height: vh }}>
      {/* الخلفية — تتكيف مع الوضع */}
      <div className="pointer-events-none absolute inset-0" style={{ background: palette(isDark).bg }} aria-hidden="true" />

      {/* لوحة 3D */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab touch-none" role="application" aria-label="خريطة العراق ثلاثية الأبعاد" />

      {/* الشريط العلوي */}
      <div className="pointer-events-none absolute start-4 top-4 z-10 flex items-center gap-3 rounded-2xl border border-line bg-[var(--overlay)] px-4 py-2.5 backdrop-blur-xl">
        <span className="text-2xl">🇮🇶</span>
        <div>
          <p className="font-kufi text-sm font-bold text-[var(--foreground)]">{t.title}</p>
          <p className="text-[9px] tracking-[3px] text-[var(--muted)]">{t.sub}</p>
        </div>
      </div>

      {/* لوحة الإحصائيات + الأكثر تغطية */}
      {showPanel && (
        <div className="absolute end-4 top-4 z-10 hidden w-56 rounded-2xl border border-line bg-[var(--overlay)] p-4 backdrop-blur-xl sm:block">
          <h3 className="mb-3 font-kufi text-xs font-bold text-[var(--foreground)]">{t.title}</h3>
          {[
            [t.capital, locale === 'en' ? 'Baghdad' : 'بغداد'],
            [t.govs, '19'],
            [t.area, t.areaVal],
            [t.lang, '2'],
          ].map(([k, v], i) => (
            <div key={i} className="flex items-center justify-between border-b border-line py-1.5 text-[11px] last:border-0">
              <span className="text-[var(--muted)]">{k}</span>
              <span className="font-bold text-[var(--foreground)]">{v}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] py-1 text-[10px] font-bold text-[var(--background)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--background)] opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--background)]" />
            </span>
            {t.live}
          </div>

          {/* الأكثر تغطية */}
          <div className="mt-4 border-t border-line pt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{t.topGovs}</p>
            <div className="space-y-1">
              {topGovs.map((g, i) => (
                <button
                  key={g.slug}
                  onClick={() => router.push(`/${locale}/governorate/${g.slug}`)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11px] transition-colors hover:bg-cream-deep"
                >
                  <span className="flex items-center gap-2 text-[var(--foreground)]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--foreground)] font-bold text-[8px] text-[var(--background)]">{i + 1}</span>
                    {govName(g)}
                  </span>
                  <span className="font-bold tabular-nums text-[var(--muted)]">{articleCount(g).toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* التسمية العائمة */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-line bg-[var(--overlay)] px-3.5 py-2 backdrop-blur-md"
          style={{ left: hovered.x + 14, top: hovered.y - 10 }}
        >
          <p className="font-kufi text-xs font-bold text-[var(--foreground)]">{hovered.name}</p>
          <p className="text-[10px] text-[var(--muted)]">
            {hovered.articles.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.news}
          </p>
          <p className="text-[9px] text-[var(--muted)]">{t.click} →</p>
        </div>
      )}

      {/* مفتاح القراءة */}
      <p className="pointer-events-none absolute bottom-4 start-4 z-10 hidden items-center gap-2 text-[10px] text-[var(--muted)] lg:flex">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
        {t.legend}
      </p>

      {/* أزرار التحكم */}
      <div className="absolute bottom-4 start-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-2xl border border-line bg-[var(--overlay)] p-1.5 backdrop-blur-xl rtl:translate-x-1/2">
        {[
          { label: t.reset, action: () => setView('reset') },
          { label: t.top, action: () => setView('top') },
          { label: t.side, action: () => setView('side') },
          { label: t.rotate, action: toggleRotate },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="rounded-xl px-3.5 py-2 text-[11px] font-medium text-[var(--muted)] transition-all duration-300 hover:bg-cream-deep hover:text-[var(--foreground)] sm:px-4"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* تلميح سفلي */}
      <p className="pointer-events-none absolute bottom-4 end-4 z-10 hidden text-[10px] text-[var(--muted)] opacity-70 lg:block">
        {t.drag} · {t.scroll}
      </p>

      {/* شاشة التحميل */}
      {!ready && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
          <span className="animate-float text-5xl">🇮🇶</span>
          <p className="animate-pulse text-xs tracking-[3px] text-[var(--muted)]">{t.loading}</p>
        </div>
      )}

      {/* فهرس المحافظات */}
      <div className="pointer-events-none absolute inset-x-4 bottom-16 z-10 hidden justify-center gap-1 overflow-hidden lg:flex">
        <div className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto scrollbar-hide rounded-xl border border-line bg-[var(--overlay)] px-2 py-1.5 backdrop-blur-md">
          {GOVERNORATES_19.map((g) => (
            <button
              key={g.slug}
              onClick={() => router.push(`/${locale}/governorate/${g.slug}`)}
              className={cn(
                'shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors',
                selected === g.slug
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'text-[var(--muted)] hover:bg-cream-deep hover:text-[var(--foreground)]'
              )}
            >
              {govName(g)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
