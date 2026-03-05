import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

interface Props {
  children: React.ReactNode
}

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Usuarios',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    exact: true,
  },
  {
    path: '/countries',
    label: 'Países',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    exact: false,
  },
]

export default function Layout({ children }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isActive = (item: typeof NAV_ITEMS[number]) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path)

  return (
    <div className="min-h-screen bg-bg font-body text-text-primary">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" stroke="#FFD400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 font-display font-bold text-lg sm:text-xl tracking-tight text-brand truncate">
              Andres Lora S.A.S
              <span className="hidden sm:inline text-text-secondary font-normal text-sm ml-1.5">People</span>
            </span>
          </Link>

          <nav className="w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1 overflow-x-auto overscroll-x-contain">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={[
                    'flex shrink-0 items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold font-body transition-all',
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-brand hover:bg-brand-light',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

