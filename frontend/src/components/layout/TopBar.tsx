import { Button } from '../ui/Button'
import senacLogo from '../../assets/SENAC_learning.png'
import styles from './TopBar.module.css'

type Props = {
  name: string
  roleLabel: string
  onLogout: () => void
}

export const TopBar = ({ name, roleLabel, onLogout }: Props) => (
  <header className={styles.bar}>
    <div className={styles.brand}>
      <img src={senacLogo} alt="Logotipo Senac Learning" className={styles.logo} loading="lazy" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
        <p className={styles.highlight}>SenacLearning</p>
        <small style={{ marginTop: '-0.2rem', fontSize: '0.95rem' }}>You connected</small>
      </div>
    </div>
    <div className={styles.user}>
      <div className={styles.meta}>
        <span className={styles.metaLabel}>Conectado como</span>
        <strong className={styles.userName}>{name}</strong>
        <span className={styles.rolePill}>{roleLabel}</span>
      </div>
      <Button variant="ghost" onClick={onLogout}>
        Sair
      </Button>
    </div>
  </header>
)
