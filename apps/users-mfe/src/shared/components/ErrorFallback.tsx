import styles from './ErrorFallback.module.scss'

interface Props {
  error: Error
}

export default function ErrorFallback({ error }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={styles.msg}>Algo salió mal</p>
      <p className={styles.detail}>{error.message}</p>
    </div>
  )
}
