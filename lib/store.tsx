'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type Note = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export type StudySession = {
  id: string
  date: string
  minutes: number
  topic: string
}

export type QuizResult = {
  id: string
  date: string
  score: number
  total: number
  topic: string
  mode: 'quiz' | 'examen'
}

export type LibraryItem = {
  id: string
  name: string
  size: number
  mimeType: string
  category: string
  description: string
  addedAt: string
}

export type AppState = {
  notes: Note[]
  sessions: StudySession[]
  quizResults: QuizResult[]
  completedLessons: string[]
  knownFlashcards: string[]
  library: LibraryItem[]
  weeklyGoalHours: number
  timerStartedAt: string | null
  timerTopic: string
}

const STORAGE_KEY = 'biochem-lab-state-v1'

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function daysAgo(n: number, hour = 18) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function createSeedState(): AppState {
  return {
    notes: [
      {
        id: uid(),
        title: 'Regulación de la glucólisis',
        content:
          'Los tres pasos irreversibles son catalizados por hexoquinasa, fosfofructoquinasa-1 (PFK-1) y piruvato quinasa.\n\nPFK-1 es el principal punto de control:\n- Activadores: AMP, fructosa-2,6-bisfosfato\n- Inhibidores: ATP, citrato, H+\n\nLa insulina aumenta la fructosa-2,6-bisfosfato en el hígado, estimulando la glucólisis.',
        category: 'Metabolismo de carbohidratos',
        tags: ['glucólisis', 'regulación', 'PFK-1'],
        pinned: true,
        createdAt: daysAgo(4),
        updatedAt: daysAgo(1),
      },
      {
        id: uid(),
        title: 'Cuerpos cetónicos: puntos clave',
        content:
          'Se sintetizan en la mitocondria hepática a partir de acetil-CoA cuando hay exceso por beta-oxidación (ayuno, diabetes tipo 1).\n\nEnzima limitante: HMG-CoA sintasa mitocondrial.\n\nEl hígado NO puede utilizarlos porque carece de succinil-CoA:acetoacetato transferasa (tioforasa).',
        category: 'Metabolismo de lípidos',
        tags: ['cetogénesis', 'ayuno'],
        pinned: false,
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
      },
      {
        id: uid(),
        title: 'Inhibidores de la cadena respiratoria',
        content:
          'Complejo I: rotenona, amital\nComplejo III: antimicina A\nComplejo IV: cianuro, monóxido de carbono, azida\nATP sintasa: oligomicina\n\nDesacoplantes: 2,4-dinitrofenol, termogenina (UCP-1) en grasa parda.',
        category: 'Bioenergética',
        tags: ['fosforilación oxidativa', 'toxicología'],
        pinned: false,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ],
    sessions: [
      { id: uid(), date: daysAgo(6), minutes: 45, topic: 'Glucólisis' },
      { id: uid(), date: daysAgo(5), minutes: 70, topic: 'Ciclo de Krebs' },
      { id: uid(), date: daysAgo(4), minutes: 30, topic: 'Enzimología' },
      { id: uid(), date: daysAgo(3), minutes: 90, topic: 'Beta-oxidación' },
      { id: uid(), date: daysAgo(2), minutes: 55, topic: 'Cetogénesis' },
      { id: uid(), date: daysAgo(1), minutes: 80, topic: 'Fosforilación oxidativa' },
    ],
    quizResults: [
      { id: uid(), date: daysAgo(5), score: 6, total: 10, topic: 'General', mode: 'quiz' },
      { id: uid(), date: daysAgo(3), score: 7, total: 10, topic: 'Metabolismo de carbohidratos', mode: 'quiz' },
      { id: uid(), date: daysAgo(1), score: 8, total: 10, topic: 'General', mode: 'examen' },
    ],
    completedLessons: ['enz-1', 'enz-2', 'carb-1'],
    knownFlashcards: [],
    library: [],
    weeklyGoalHours: 10,
    timerStartedAt: null,
    timerTopic: 'Estudio general',
  }
}

type StoreContextValue = {
  state: AppState
  hydrated: boolean
  saveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => string
  deleteNote: (id: string) => void
  togglePinNote: (id: string) => void
  addSession: (minutes: number, topic: string) => void
  deleteSession: (id: string) => void
  addQuizResult: (r: Omit<QuizResult, 'id' | 'date'>) => void
  toggleLesson: (lessonId: string) => void
  setFlashcardKnown: (cardId: string, known: boolean) => void
  addLibraryItem: (item: LibraryItem) => void
  updateLibraryItem: (id: string, patch: Partial<LibraryItem>) => void
  removeLibraryItem: (id: string) => void
  setWeeklyGoal: (hours: number) => void
  startTimer: (topic: string) => void
  stopTimer: () => number
  cancelTimer: () => void
  resetAll: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(createSeedState)
  const [hydrated, setHydrated] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>
        setState((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // Corrupt storage falls back to seed data.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const saveNote = useCallback<StoreContextValue['saveNote']>((input) => {
    const now = new Date().toISOString()
    const id = input.id ?? uid()
    setState((s) => {
      const exists = s.notes.some((n) => n.id === id)
      const notes = exists
        ? s.notes.map((n) => (n.id === id ? { ...n, ...input, id, updatedAt: now } : n))
        : [{ ...input, id, createdAt: now, updatedAt: now }, ...s.notes]
      return { ...s, notes }
    })
    return id
  }, [])

  const deleteNote = useCallback((id: string) => {
    setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }))
  }, [])

  const togglePinNote = useCallback((id: string) => {
    setState((s) => ({ ...s, notes: s.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)) }))
  }, [])

  const addSession = useCallback((minutes: number, topic: string) => {
    if (minutes <= 0) return
    setState((s) => ({
      ...s,
      sessions: [...s.sessions, { id: uid(), date: new Date().toISOString(), minutes, topic }],
    }))
  }, [])

  const deleteSession = useCallback((id: string) => {
    setState((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) }))
  }, [])

  const addQuizResult = useCallback((r: Omit<QuizResult, 'id' | 'date'>) => {
    setState((s) => ({
      ...s,
      quizResults: [...s.quizResults, { ...r, id: uid(), date: new Date().toISOString() }],
    }))
  }, [])

  const toggleLesson = useCallback((lessonId: string) => {
    setState((s) => ({
      ...s,
      completedLessons: s.completedLessons.includes(lessonId)
        ? s.completedLessons.filter((l) => l !== lessonId)
        : [...s.completedLessons, lessonId],
    }))
  }, [])

  const setFlashcardKnown = useCallback((cardId: string, known: boolean) => {
    setState((s) => {
      const set = new Set(s.knownFlashcards)
      if (known) set.add(cardId)
      else set.delete(cardId)
      return { ...s, knownFlashcards: [...set] }
    })
  }, [])

  const addLibraryItem = useCallback((item: LibraryItem) => {
    setState((s) => ({ ...s, library: [item, ...s.library] }))
  }, [])

  const updateLibraryItem = useCallback((id: string, patch: Partial<LibraryItem>) => {
    setState((s) => ({ ...s, library: s.library.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
  }, [])

  const removeLibraryItem = useCallback((id: string) => {
    setState((s) => ({ ...s, library: s.library.filter((i) => i.id !== id) }))
  }, [])

  const setWeeklyGoal = useCallback((hours: number) => {
    setState((s) => ({ ...s, weeklyGoalHours: Math.max(1, Math.min(80, Math.round(hours))) }))
  }, [])

  const startTimer = useCallback((topic: string) => {
    setState((s) => ({ ...s, timerStartedAt: new Date().toISOString(), timerTopic: topic || 'Estudio general' }))
  }, [])

  const stopTimer = useCallback(() => {
    const s = stateRef.current
    if (!s.timerStartedAt) return 0
    const minutes = Math.round((Date.now() - new Date(s.timerStartedAt).getTime()) / 60000)
    setState((prev) => ({
      ...prev,
      timerStartedAt: null,
      sessions:
        minutes > 0
          ? [...prev.sessions, { id: uid(), date: new Date().toISOString(), minutes, topic: prev.timerTopic }]
          : prev.sessions,
    }))
    return minutes
  }, [])

  const cancelTimer = useCallback(() => {
    setState((s) => ({ ...s, timerStartedAt: null }))
  }, [])

  const resetAll = useCallback(() => {
    setState({ ...createSeedState(), notes: [], sessions: [], quizResults: [], completedLessons: [], library: [] })
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      hydrated,
      saveNote,
      deleteNote,
      togglePinNote,
      addSession,
      deleteSession,
      addQuizResult,
      toggleLesson,
      setFlashcardKnown,
      addLibraryItem,
      updateLibraryItem,
      removeLibraryItem,
      setWeeklyGoal,
      startTimer,
      stopTimer,
      cancelTimer,
      resetAll,
    }),
    [
      state,
      hydrated,
      saveNote,
      deleteNote,
      togglePinNote,
      addSession,
      deleteSession,
      addQuizResult,
      toggleLesson,
      setFlashcardKnown,
      addLibraryItem,
      updateLibraryItem,
      removeLibraryItem,
      setWeeklyGoal,
      startTimer,
      stopTimer,
      cancelTimer,
      resetAll,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}

export function startOfWeek(d = new Date()) {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}

export function formatMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
