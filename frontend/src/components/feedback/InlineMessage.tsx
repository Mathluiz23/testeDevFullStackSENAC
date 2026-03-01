import type { ReactNode } from 'react'
import styles from './InlineMessage.module.css'

type Props = {
  tone?: 'success' | 'danger' | 'info'
  message: ReactNode
  className?: string
}

export const InlineMessage = ({ tone = 'info', message, className }: Props) => {
  const classes = [styles.message, styles[tone], className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <span>{message}</span>
    </div>
  )
}
