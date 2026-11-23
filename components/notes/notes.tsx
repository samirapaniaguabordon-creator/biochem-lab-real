'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, NotebookPen, Pin, PinOff, Plus, Search, Trash2 } from 'lucide-react'
import { useStore, type Note } from '@/lib/store'
import { chapters } from '@/lib/data/chapters'
import { formatDate } from '@/lib/stats'
import { Badge, Btn, Card, EmptyState, PageHeader, inputClass } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

const noteCategories = ['General', ...chapters.map((c) => c.title)]

type Draft = { id?: string; title: string; content: string; category: string; tags: string; pinned: boolean }

const emptyDraft: Draft = { title: '', content: '', category: 'General', tags: '', pinned: false }

function toDraft(n: Note): Draft {
  return { id: n.id, title: n.title, content: n.content, category: n.category, tags: n.tags.join(', '), pinned: n.pinned }
}

function highlight(text: string, q: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-chart-2/30 text-foreground">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export function Notes() {
  const { state, saveNote, deleteNote, togglePinNote } = useStore()
  const params = useSearchParams()
  const router = useRouter()

  const [draft, setDraft] = useState<Draft | null>(() => {
    if (params.get('nuevo')) return emptyDraft
    const n = state.notes.find((x) => x.id === params.get('nota'))
    return n ? toDraft(n) : null
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const filtered = state.notes
    .filter((n) => category === 'Todas' || n.category === category)
    .filter((n) => {
      if (!query) return true
      const q = query.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))

  function open(d: Draft | null) {
    setDraft(d)
    setSavedAt(null)
    router.replace(d?.id ? `/apuntes?nota=${d.id}` : '/apuntes', { scroll: false })
  }

  function save() {
    if (!draft || !draft.title.trim()) return
    const id = saveNote({
      id: draft.id,
      title: draft.title.trim(),
      content: draft.content,
      category: draft.category,
      tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      pinned: draft.pinned,
    })
    setDraft({ ...draft, id })
    setSavedAt(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    router.replace(`/apuntes?nota=${id}`, { scroll: false })
  }

  function remove() {
    if (!draft?.id) return open(null)
    if (!confirm('¿Eliminar este apunte? Esta acción no se puede deshacer.')) return
    deleteNote(draft.id)
    open(null)
  }

  const list = (
    <div className={cn('flex flex-col gap-3', draft && 'hidden lg:flex')}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en título, contenido o etiquetas…"
          aria-label="Buscar apuntes"
          className={cn(inputClass, 'pl-9')}
        />
      </div>
      <label className="sr-only" htmlFor="note-cat-filter">
        Filtrar por categoría
      </label>
      <select id="note-cat-filter" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
        <option>Todas</option>
        {noteCategories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'apunte' : 'apuntes'}
      </p>
      {state.notes.length === 0 ? (
        <EmptyState
          icon={<NotebookPen className="size-6" aria-hidden="true" />}
          title="Sin apuntes todavía"
          description="Crea tu primer apunte para empezar a organizar tu estudio."
          action={<Btn onClick={() => open(emptyDraft)}>Nuevo apunte</Btn>}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => open(toDraft(n))}
                aria-current={draft?.id === n.id ? 'true' : undefined}
                className={cn(
                  'flex w-full flex-col gap-1.5 rounded-xl border bg-card p-4 text-left transition-colors',
                  draft?.id === n.id ? 'border-highlight ring-1 ring-highlight/40' : 'border-border hover:border-highlight/50',
                )}
              >
                <span className="flex items-center gap-2">
                  {n.pinned && <Pin className="size-3.5 shrink-0 text-highlight" aria-label="Fijado" />}
                  <span className="truncate font-medium">{highlight(n.title, query)}</span>
                </span>
                <span className="line-clamp-2 text-sm text-muted-foreground">{n.content || 'Sin contenido'}</span>
                <span className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge>{n.category}</Badge>
                  {n.tags.slice(0, 3).map((t) => (
                    <Badge key={t} tone="accent">
                      #{t}
                    </Badge>
                  ))}
                  <span className="ml-auto text-xs text-muted-foreground">{formatDate(n.updatedAt)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div>
      <PageHeader
        eyebrow="Módulo 2"
        title="Mis apuntes"
        description="Crea, edita, organiza y busca tus notas de bioquímica. Se guardan automáticamente en este dispositivo."
        actions={
          <Btn onClick={() => open(emptyDraft)}>
            <Plus className="size-4" aria-hidden="true" /> Nuevo apunte
          </Btn>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {list}
        {draft ? (
          <Card className="flex flex-col gap-4 p-4 sm:p-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2">
              <Btn variant="ghost" className="px-2 lg:hidden" onClick={() => open(null)} aria-label="Volver a la lista">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Btn>
              <h2 className="font-semibold">{draft.id ? 'Editar apunte' : 'Nuevo apunte'}</h2>
              <div className="ml-auto flex items-center gap-1">
                {draft.id && (
                  <Btn
                    variant="ghost"
                    className="px-3"
                    onClick={() => {
                      togglePinNote(draft.id as string)
                      setDraft({ ...draft, pinned: !draft.pinned })
                    }}
                    aria-label={draft.pinned ? 'Desfijar apunte' : 'Fijar apunte'}
                    aria-pressed={draft.pinned}
                  >
                    {draft.pinned ? <PinOff className="size-4" aria-hidden="true" /> : <Pin className="size-4" aria-hidden="true" />}
                  </Btn>
                )}
                <Btn variant="ghost" className="px-3 text-destructive" onClick={remove} aria-label="Eliminar apunte">
                  <Trash2 className="size-4" aria-hidden="true" />
                </Btn>
              </div>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                save()
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="note-title" className="text-sm font-medium">
                  Título
                </label>
                <input
                  id="note-title"
                  required
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Ej.: Regulación de la PFK-1"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="note-cat" className="text-sm font-medium">
                    Categoría
                  </label>
                  <select id="note-cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputClass}>
                    {noteCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="note-tags" className="text-sm font-medium">
                    Etiquetas <span className="font-normal text-muted-foreground">(separadas por comas)</span>
                  </label>
                  <input
                    id="note-tags"
                    value={draft.tags}
                    onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                    placeholder="glucólisis, examen"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="note-content" className="text-sm font-medium">
                  Contenido
                </label>
                <textarea
                  id="note-content"
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  rows={14}
                  placeholder="Escribe tus apuntes aquí…"
                  className={cn(inputClass, 'min-h-64 py-3 leading-relaxed')}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Btn type="submit" disabled={!draft.title.trim()}>
                  Guardar apunte
                </Btn>
                <Btn variant="outline" onClick={() => open(null)}>
                  Cerrar
                </Btn>
                {savedAt && (
                  <span role="status" className="text-sm text-success">
                    Guardado a las {savedAt}
                  </span>
                )}
              </div>
            </form>
          </Card>
        ) : (
          <Card className="hidden flex-col items-center justify-center gap-3 border-dashed p-10 text-center lg:flex">
            <NotebookPen className="size-8 text-highlight" aria-hidden="true" />
            <p className="font-medium">Selecciona un apunte para editarlo</p>
            <p className="text-sm text-muted-foreground">o crea uno nuevo con el botón superior.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
