'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Newspaper, FolderTree, Mic, MessageSquare, Mail,
  Users, Image as ImageIcon, Settings, UserCircle, LogOut, ExternalLink,
  Menu, X, ChevronDown, Shield, PenSquare, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IshtarStar } from '@/components/brand/Brand'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'مدير عام',
  EDITOR: 'محرر',
  JOURNALIST: 'صحفي',
  READER: 'قارئ',
}

const NAV_ITEMS = [
  { href: '/admin', label: 'نظرة عامة', icon: LayoutDashboard, permission: 'dashboard.view', exact: true },
  { href: '/admin/articles', label: 'المقالات', icon: Newspaper, permission: 'articles.view.own' },
  { href: '/admin/categories', label: 'الأقسام', icon: FolderTree, permission: 'categories.manage' },
  { href: '/admin/podcasts', label: 'البودكاست', icon: Mic, permission: 'podcasts.manage' },
  { href: '/admin/comments', label: 'التعليقات', icon: MessageSquare, permission: 'comments.moderate' },
  { href: '/admin/media', label: 'الوسائط', icon: ImageIcon, permission: 'media.manage' },
  { href: '/admin/newsletter', label: 'النشرة البريدية', icon: Mail, permission: 'newsletter.view' },
  { href: '/admin/users', label: 'فريق التحرير', icon: Users, permission: 'users.manage' },
  { href: '/admin/integrations', label: 'التكاملات', icon: Zap, permission: 'settings.manage' },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings, permission: 'settings.manage' },
]

const ROLE_LEVEL: Record<string, number> = { READER: 0, JOURNALIST: 1, EDITOR: 2, ADMIN: 3 }
const PERMISSION_MIN: Record<string, string> = {
  'dashboard.view': 'JOURNALIST',
  'articles.view.own': 'JOURNALIST',
  'categories.manage': 'EDITOR',
  'podcasts.manage': 'EDITOR',
  'comments.moderate': 'EDITOR',
  'media.manage': 'EDITOR',
  'newsletter.view': 'EDITOR',
  'users.manage': 'ADMIN',
  'integrations.manage': 'ADMIN',
  'settings.manage': 'ADMIN',
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const visibleItems = NAV_ITEMS.filter((item) => {
    const min = PERMISSION_MIN[item.permission] || 'ADMIN'
    return (ROLE_LEVEL[user.role] || 0) >= (ROLE_LEVEL[min] || 3)
  })

  const isActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* الشعار */}
      <div className="flex items-center justify-between border-b border-gold-500/15 px-5 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-700 to-lapis-950 ring-1 ring-gold-500/40">
            <IshtarStar size={26} />
          </span>
          <span>
            <span className="block font-kufi text-base font-bold text-white">العراق الآن</span>
            <span className="block text-[10px] font-medium text-gold-400">لوحة التحكم</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-sand-100/60 hover:bg-white/10 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* إنشاء سريع */}
      <div className="p-4">
        <Link
          href="/admin/articles/new"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold-400 to-gold-600 px-4 py-2.5 text-sm font-bold text-lapis-950 shadow-lg shadow-gold-500/20 transition-all hover:shadow-gold-500/40"
        >
          <PenSquare className="h-4 w-4" />
          مقال جديد
        </Link>
      </div>

      {/* التنقل */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visibleItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gold-500/15 text-gold-300 shadow-inner'
                  : 'text-sand-100/60 hover:bg-white/5 hover:text-sand-100'
              )}
            >
              <item.icon className={cn('h-4.5 w-4.5 shrink-0 transition-colors', active ? 'text-gold-400' : 'text-sand-100/40 group-hover:text-gold-400/70')} />
              <span className="flex-1">{item.label}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />}
            </Link>
          )
        })}
      </nav>

      {/* بطاقة المستخدم */}
      <div className="border-t border-gold-500/15 p-4">
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
          >
            {user.image ? (
              <img src={user.image} alt="" className="h-9 w-9 rounded-lg object-cover ring-2 ring-gold-500/40" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-lapis-600 to-lapis-900 font-kufi text-sm font-bold text-gold-400 ring-2 ring-gold-500/30">
                {user.name.charAt(0)}
              </span>
            )}
            <span className="min-w-0 flex-1 text-start">
              <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="flex items-center gap-1 text-[10px] text-gold-400">
                <Shield className="h-2.5 w-2.5" />
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </span>
            <ChevronDown className={cn('h-4 w-4 text-sand-100/40 transition-transform', userOpen && 'rotate-180')} />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
              <div className="absolute bottom-full start-0 end-0 z-20 mb-2 overflow-hidden rounded-xl border border-gold-500/20 bg-lapis-900 shadow-2xl">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-sand-100/80 transition-colors hover:bg-white/5 hover:text-gold-300"
                  onClick={() => setUserOpen(false)}
                >
                  <UserCircle className="h-4 w-4" />
                  ملفي الشخصي
                </Link>
                <Link
                  href="/ar"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-sand-100/80 transition-colors hover:bg-white/5 hover:text-gold-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  عرض الموقع
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/ar' })}
                  className="flex w-full items-center gap-2.5 border-t border-gold-500/10 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* قائمة سطح المكتب */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-e border-gold-500/10 bg-gradient-to-b from-lapis-950 to-ink-950 lg:block">
        {sidebar}
      </aside>

      {/* قائمة الجوال */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 end-0 w-[85%] max-w-xs border-s border-gold-500/15 bg-gradient-to-b from-lapis-950 to-ink-950">
            {sidebar}
          </aside>
        </div>
      )}

      {/* المحتوى */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* الشريط العلوي للجوال */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gold-500/10 bg-lapis-950/95 px-4 py-3 backdrop-blur-lg lg:hidden">
          <div className="flex items-center gap-2">
            <IshtarStar size={24} />
            <span className="font-kufi text-sm font-bold text-white">لوحة التحكم</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-sand-100/70 transition-colors hover:bg-white/10"
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

