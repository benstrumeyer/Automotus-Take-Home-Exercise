import styles from './loading-spinner.module.scss'

interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} aria-hidden="true" />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  )
}
