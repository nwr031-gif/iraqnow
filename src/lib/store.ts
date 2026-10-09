import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'ar' | 'ku' | 'en'

interface UIState {
  locale: Locale
  setLocale: (locale: Locale) => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-store',
    }
  )
)