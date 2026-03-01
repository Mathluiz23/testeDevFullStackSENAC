import { useEffect, useRef, useState } from 'react'
import styles from './SelectField.module.css'

type Option = {
  value: string | number
  label: string
  description?: string
}

type Props = {
  id: string
  label: string
  options: Option[]
  value?: string | number
  onChange?: (event: { target: { value: string } }) => void
  hint?: string
  error?: string
  disabled?: boolean
}

export const SelectField = ({ id, label, options, value, onChange, hint, error, disabled }: Props) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => String(o.value) === String(value)) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open])

  const handleSelect = (opt: Option) => {
    onChange?.({ target: { value: String(opt.value) } })
    setOpen(false)
  }

  return (
    <div className={styles.field} ref={wrapperRef}>
      <span className={styles.label}>{label}</span>
      <button
        type="button"
        id={id}
        className={`${styles.control} ${error ? styles.error : ''} ${open ? styles.open : ''}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.selectedText}>{selected?.label ?? 'Selecione'}</span>
        <span className={styles.arrow} />
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={String(opt.value) === String(value)}
              className={`${styles.option} ${String(opt.value) === String(value) ? styles.optionSelected : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {error ? <small className={styles.errorText}>{error}</small> : hint && <small>{hint}</small>}
    </div>
  )
}
