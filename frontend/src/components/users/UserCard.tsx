import type { UserModel } from '../../types'
import styles from './UserCard.module.css'
import { useEffect, useRef, useState } from 'react';

type Props = {
  user: UserModel
  onEdit?: (user: UserModel) => void
  onDelete?: (user: UserModel) => void
}

export const UserCard = ({ user, onEdit, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <article className={styles.card}>
      <div className={styles.identity}>
        <div className={styles.avatar}>{user.name.charAt(0)}</div>
        <div className={styles.meta}>
          <div className={styles.identityHeader}>
            <p className={styles.name}>{user.name}</p>
            <span className={styles.rolePill}>{user.roleLabel}</span>
          </div>
          <div className={styles.infoGrid}>
            <div>
              <span className={styles.label}>E-mail</span>
              <p className={styles.value}>{user.email}</p>
            </div>
            <div>
              <span className={styles.label}>CPF</span>
              <p className={styles.value}>{user.cpfFormatted}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        {(user.actions.canEdit || user.actions.canDelete) && (
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              className={styles.dropdownButton}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={open}
            >
              Ações <span style={{fontSize: '1.1em'}}>▼</span>
            </button>
            <div
              className={styles.dropdownMenu}
              style={{ display: open ? 'block' : 'none', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
            >
              {user.actions.canEdit && (
                <button className={styles.dropdownItem} onClick={() => { setOpen(false); onEdit?.(user); }}>
                  <span className={styles.icon} aria-label="Editar" title="Editar">
                    {/* Ícone lápis SVG */}
                    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em"><path d="M15.7 4.3a1 1 0 0 1 1.4 1.4l-9.2 9.2-2.1.7.7-2.1 9.2-9.2zm-1.4-1.4a3 3 0 0 1 4.2 4.2l-9.2 9.2a1 1 0 0 1-.4.2l-3.1 1a1 1 0 0 1-1.3-1.3l1-3.1a1 1 0 0 1 .2-.4l9.2-9.2z"/></svg>
                  </span>
                  Editar
                </button>
              )}
              {user.actions.canDelete && (
                <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => { setOpen(false); onDelete?.(user); }}>
                  <span className={styles.icon} aria-label="Excluir" title="Excluir">
                    {/* Ícone lixeira SVG */}
                    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em"><path d="M7 8v6a1 1 0 0 0 2 0V8a1 1 0 0 0-2 0zm4 0v6a1 1 0 0 0 2 0V8a1 1 0 0 0-2 0zM5 6V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h3a1 1 0 1 1 0 2h-1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h3zm2-1v1h6V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1z"/></svg>
                  </span>
                  Excluir
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
