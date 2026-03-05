import { motion } from 'motion/react'
import { useUsersStore } from '../store/usersStore'
import styles from './Pagination.module.scss'

interface Props {
  totalPages: number
  total: number
}

export default function Pagination({ totalPages, total }: Props) {
  const { page, pageSize, setPage } = useUsersStore()

  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pages = buildPageRange(page, totalPages)

  return (
    <div className={styles.root}>
      <p className={styles.summary}>
        Mostrando{' '}
        <span className={styles.summaryHighlight}>{start}–{end}</span>{' '}
        de <span className={styles.summaryTotal}>{total}</span> personas
      </p>
      <nav className={styles.nav} aria-label="Paginación">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={styles.prevNextBtn}
        >
          ←
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <motion.button
              key={p}
              onClick={() => setPage(p as number)}
              whileTap={{ scale: 0.88 }}
              className={`${styles.pageBtn}${p === page ? ` ${styles.active}` : ''}`}
            >
              {p}
            </motion.button>
          ),
        )}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={styles.prevNextBtn}
        >
          →
        </button>
      </nav>

      {/* Andres Lora S.A.S-style yellow accent bar under pagination */}
      <div className={styles.accent} />
    </div>
  )
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
