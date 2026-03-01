import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './InputField.module.css'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  icon?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

export const InputField = ({
  id,
  label,
  value,
  onChange,
  type: inputType = 'text',
  placeholder,
  hint,
  error,
  icon,
  ...props
}: Props) => {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <div className={`${styles.control} ${error ? styles.error : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
      </div>
      {error ? <small className={styles.errorText}>{error}</small> : hint && <small>{hint}</small>}
    </label>
  )
}
