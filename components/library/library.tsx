'use client'

import { useRef, useState } from 'react'
import { ExternalLink, FileText, FileImage, File, Search, Trash2, Upload, Library as LibraryIcon } from 'lucide-react'
import { useStore, uid, type LibraryItem } from '@/lib/store'
import { deleteFile, getFile, saveFile } from '@/lib/file-db'
import { formatDate } from '@/lib/stats'
import { Badge, Btn, Card, EmptyState, PageHeader, Segmented, inputClass } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

export const libraryCategories = ['Libros', 'Apuntes', 'Artículos', 'Guías', 'Otros'] as const
const MAX_SIZE = 50 * 1024 * 1024

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function FileIcon({ mime }: { mime: string }) {
  if (mime === 'application/pdf') return <FileText className="size-5" aria-hidden="true" />
  if (mime.startsWith('image/')) return <FileImage className="size-5" aria-hidden="true" />
  return <File className="size-5" aria-hidden="true" />
}

function guessCategory(name: string) {
  const n = name.toLowerCase()
  if (/(libro|book|harper|lehninger|lippincott|tratado)/.test(n)) return 'Libros'
  if (/(apunte|nota|resumen)/.test(n)) return 'Apuntes'
  if (/(articulo|artículo|paper|review)/.test(n)) return 'Artículos'
  if (/(guia|guía|practica|práctica)/.test(n)) return 'Guías'
  return n.endsWith('.pdf') ? 'Libros' : 'Otros'
}

export function Library() {
  const { state, addLibraryItem, updateLibraryItem, removeLibraryItem } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<string>('Todos')
  const [query, setQuery] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleFiles(files: FileList | File[]) {
    setError(null)
    setBusy(true)
    const rejected: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        rejected.push(file.name)
        continue
      }
      const id = uid()
      try {
        await saveFile(id, file)
        addLibraryItem({
          id,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          category: guessCategory(file.name),
          description: '',
          addedAt: new Date().toISOString(),
        })
      } catch {
        rejected.push(file.name)
      }
    }
    setBusy(false)
    if (rejected.length) setError(`No se pudieron guardar: ${rejected.join(', ')} (máximo 50 MB por archivo).`)
  }

  async function openItem(item: LibraryItem) {
    const blob = await getFile(item.id)
    if (!blob) {
      setError('El archivo ya no está disponible en este dispositivo.')
      return
    }
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  async function removeItem(item: LibraryItem) {
    if (!confirm(`¿Eliminar "${item.name}" de tu biblioteca?`)) return
    await deleteFile(item.id).catch(() => undefined)
    removeLibraryItem(item.id)
  }

  const counts = Object.fromEntries(libraryCategories.map((c) => [c, state.library.filter((i) => i.category === c).length]))
  const items = state.library.filter(
    (i) =>
      (filter === 'Todos' || i.category === filter) &&
      (query === '' || `${i.name} ${i.description}`.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <div>
      <PageHeader
        eyebrow="Módulo 1"
        title="Mi biblioteca"
        description="Sube tus libros en PDF, apuntes y documentos de estudio. Se guardan de forma privada en este dispositivo."
        actions={
          <Btn onClick={() => inputRef.current?.click()} disabled={busy}>
            <Upload className="size-4" aria-hidden="true" />
            {busy ? 'Subiendo…' : 'Subir archivos'}
          </Btn>
        }
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,image/*"
        className="sr-only"
        aria-label="Seleccionar archivos para subir"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'mb-6 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors',
          dragging ? 'border-highlight bg-accent' : 'border-border bg-card hover:border-highlight/50',
        )}
      >
        <Upload className="size-6 text-highlight" aria-hidden="true" />
        <span className="font-medium">Arrastra tus archivos aquí o toca para seleccionarlos</span>
        <span className="text-sm text-muted-foreground">PDF, Word, PowerPoint, imágenes o texto · hasta 50 MB</span>
      </button>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar documentos…"
            aria-label="Buscar documentos"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        <Segmented
          label="Filtrar por categoría"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'Todos', label: `Todos (${state.library.length})` },
            ...libraryCategories.map((c) => ({ value: c, label: `${c} (${counts[c]})` })),
          ]}
        />
      </div>

      {state.library.length === 0 ? (
        <EmptyState
          icon={<LibraryIcon className="size-6" aria-hidden="true" />}
          title="Tu biblioteca está vacía"
          description="Sube tu primer libro de bioquímica (por ejemplo, Lehninger o Harper) para tenerlo siempre a mano."
          action={<Btn onClick={() => inputRef.current?.click()}>Subir archivo</Btn>}
        />
      ) : items.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">No hay documentos que coincidan con tu búsqueda.</Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-highlight">
                    <FileIcon mime={item.mimeType} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(item.size)} · {formatDate(item.addedAt)}
                    </p>
                  </div>
                  <Badge tone="accent">{item.category}</Badge>
                </div>
                <input
                  value={item.description}
                  onChange={(e) => updateLibraryItem(item.id, { description: e.target.value })}
                  placeholder="Añade una descripción (capítulo, tema…)"
                  aria-label={`Descripción de ${item.name}`}
                  className={inputClass}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`cat-${item.id}`}>
                    Categoría
                  </label>
                  <select
                    id={`cat-${item.id}`}
                    value={item.category}
                    onChange={(e) => updateLibraryItem(item.id, { category: e.target.value })}
                    className={cn(inputClass, 'w-auto flex-1')}
                  >
                    {libraryCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <Btn variant="outline" onClick={() => openItem(item)}>
                    <ExternalLink className="size-4" aria-hidden="true" /> Abrir
                  </Btn>
                  <Btn variant="ghost" onClick={() => removeItem(item)} aria-label={`Eliminar ${item.name}`} className="px-3 text-destructive">
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Btn>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
