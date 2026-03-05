import { useCountriesStore } from '../../store/countriesStore'
import styles from './Pagination.module.scss'

interface Props {
  totalPages: number
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = [1]

  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')
  pages.push(total)

  return pages
}

export default function Pagination({ totalPages, total }: Props & { total?: number }) {
  const { page, pageSize, setPage } = useCountriesStore()

  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total ?? 0)

  const range = buildPageRange(page, totalPages)

  return (
    <nav className={styles.wrapper} aria-label="Paginación de países">
      {total != null && (
        <p className={styles.summary}>
          Mostrando <strong>{start}–{end}</strong> de <strong>{total}</strong> países
        </p>
      )}
      <div className={styles.pages}>
        <button
          className={styles.btn}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {range.map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className={`${styles.btn} ${styles.dots}`}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.btn} ${p === page ? styles.active : ''}`}
              onClick={() => setPage(p as number)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.btn}
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Página siguiente"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.accentBar} />
    </nav>
  )
}
