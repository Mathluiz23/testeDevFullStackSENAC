import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Props = {
  variant?: 'solid' | 'ghost' | 'danger'
  full?: boolean
  loading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
  children,
  variant = 'solid',
  full,
  loading,
  disabled,
  ...props
}: Props) => (
  <button
    className={`${styles.button} ${styles[variant]} ${full ? styles.full : ''}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? 'Processando...' : children}
  </button>
)
