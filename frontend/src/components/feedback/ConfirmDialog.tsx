import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import styles from './ConfirmDialog.module.css'

type Props = {
  open: boolean
  title?: string
  message?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'neutral' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'neutral',
  onCancel,
  onConfirm,
}: Props) => {
  if (!open) return null

  return (
    <div className={styles.overlay} role="alertdialog" aria-modal="true" aria-live="assertive">
      <div className={`${styles.dialog} ${tone === 'danger' ? styles.danger : ''}`}>
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {message && <p className={styles.message}>{message}</p>}
        </header>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'solid'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
