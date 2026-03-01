import type { FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/InputField'
import { InlineMessage } from '../../components/feedback/InlineMessage'
import { formatCpf } from '../../utils/ValidatedCPF'
import { useAuth } from '../../hooks/useAuth'
import senacLearningLogo from '../../assets/SENAC_learning.png'
import senacLogo from '../../assets/SENAC_logo.png'
import styles from './LoginPage.module.css'

export const LoginPage = () => {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<ReactNode | null>(null)
  useEffect(() => {
    if (user) {
      if (user.mustChangePassword) {
        navigate('/trocar-senha', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [user, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isLoading) return

    try {
      setError(null)
      const cpfNumeros = cpf.replace(/\D/g, '')
      await login(cpfNumeros, password)
    } catch (err) {
      let msg = 'Não foi possível autenticar.'
      if (err instanceof Error) {
        if (err.message.includes('CPF') || err.message.includes('inválidos') || err.message.includes('senha')) {
          msg = 'Usuário ou senha inválidos. Verifique os dados e tente novamente.'
        } else if (err.message.includes('inválid') || err.message.includes('422')) {
          msg = 'Usuário não cadastrado ou dados inválidos.'
        } else {
          msg = err.message
        }
      }
      setError(msg)
    }
  }

  return (
    <section className={`${styles.scene} bg-marquee`}>
      <div className={styles.overlay} />
      <img src={senacLogo} alt="Logotipo institucional do Senac" className={styles.sceneLogo} loading="lazy" />
      <div className={`${styles.card} fade-in`}>
        <header className={styles.branding}>
          <img src={senacLearningLogo} alt="Logotipo Senac Learning" className={styles.brandLogo} loading="lazy" />
          <div>
            <h1>SenacLearning</h1>
            <p>Faça o seu login</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            id="cpf"
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(value) => setCpf(formatCpf(value))}
            inputMode="numeric"
            maxLength={14}
            required
          />

          <InputField
            id="password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={setPassword}
            required
          />

          <Button type="submit" full loading={isLoading}>
            Acesse agora
          </Button>
          <div className={styles.feedbackArea}>
            {error && <InlineMessage className={styles.alert} tone="danger" message={error} />}
          </div>
          <button
            type="button"
            className={styles.helper}
            onClick={() => navigate('/esqueci-senha')}
          >
            Esqueci meu login ou senha
          </button>
        </form>
      </div>
    </section>
  )
}
