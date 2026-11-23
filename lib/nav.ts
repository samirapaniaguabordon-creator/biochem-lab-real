import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  Library,
  NotebookPen,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export const dashboardItem: NavItem = {
  href: '/',
  label: 'Panel principal',
  description: 'Resumen de tu progreso',
  icon: LayoutDashboard,
}

export const moduleItems: NavItem[] = [
  { href: '/biblioteca', label: 'Mi biblioteca', description: 'Libros, PDFs y documentos de estudio', icon: Library },
  { href: '/apuntes', label: 'Mis apuntes', description: 'Crea, edita y busca tus notas', icon: NotebookPen },
  { href: '/rutas', label: 'Rutas metabólicas', description: 'Diagramas interactivos paso a paso', icon: Workflow },
  { href: '/bioquimica', label: 'Bioquímica', description: 'Capítulos, lecciones y resúmenes', icon: BookOpen },
  { href: '/graficos', label: 'Gráficos', description: 'Cinética, curvas y rendimiento energético', icon: LineChart },
  { href: '/estadisticas', label: 'Estadísticas', description: 'Horas, capítulos y puntuaciones', icon: BarChart3 },
  { href: '/evaluaciones', label: 'Evaluaciones', description: 'Preguntas, flashcards y exámenes', icon: ClipboardCheck },
]

export const brandIcon = FlaskConical
