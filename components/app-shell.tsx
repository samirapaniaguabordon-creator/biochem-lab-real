'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { brandIcon as BrandIcon, dashboardItem, moduleItems, type NavItem } from '@/lib/nav'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { StudyTimer } from '@/components/study-timer'

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className={cn('size-4.5 shrink-0', active && 'text-sidebar-primary')} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  )
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-3 px-2 pt-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <BrandIcon className="size-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-sidebar-accent-foreground">BioChem Lab</span>
          <span className="text-xs text-sidebar-foreground/60">Bioquímica médica</span>
        </span>
      </Link>
      <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <NavLink item={dashboardItem} active={isActive('/')} onNavigate={onNavigate} />
        <p className="mt-4 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Módulos
        </p>
        {moduleItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onNavigate} />
        ))}
      </nav>
      <p className="px-3 text-xs text-sidebar-foreground/50">Tus datos se guardan en este dispositivo.</p>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { hydrated } = useStore()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar shadow-xl animate-in slide-in-from-left">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-3 flex size-11 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Cerrar menú"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-11 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold lg:hidden">
            <BrandIcon className="size-5 text-highlight" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">BioChem Lab</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <StudyTimer />
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {hydrated ? (
            children
          ) : (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando">
              <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-28 animate-pulse rounded-xl bg-muted" />
                <div className="h-28 animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
