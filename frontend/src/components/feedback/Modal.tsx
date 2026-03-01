import type { ReactNode } from 'react'
import { useEffect } from 'react'
import styles from './Modal.module.css'

type ModalSize = 'small' | 'medium' | 'large'

type Props = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  size?: ModalSize
}

export const Modal = ({ open, title, description, onClose, children, size = 'medium' }: Props) => {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const sizeClass =
    size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={`${styles.modal} ${sizeClass}`}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <header className={styles.header}>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
