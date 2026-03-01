import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/InputField'
import api from '../../services/api'
import styles from './ChangePasswordPage.module.css'

const SECURITY_QUESTIONS = [
  'Qual o nome do seu primeiro animal de estimação?',
  'Qual a cidade onde você nasceu?',
  'Qual o nome da sua mãe?',
  'Qual era o nome da sua escola?',
  'Qual o modelo do seu primeiro carro?',
  'Qual o nome do seu melhor amigo de infância?',
]

export const ChangePasswordPage = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0])
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const needsSecurityQuestion = !user.hasSecurityQuestion

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }
    if (needsSecurityQuestion && !securityAnswer.trim()) {
      setError('Preencha a resposta da pergunta de segurança.')
      return
    }
    setLoading(true)
    try {
      const payload: Record<string, string> = { password }
      if (needsSecurityQuestion) {
        payload.security_question = securityQuestion
        payload.security_answer = securityAnswer
      }
      await api.post(`/users/${user.id}/change-password`, payload)
      setUser({ ...user, mustChangePassword: false, hasSecurityQuestion: true })
      navigate('/')
    } catch {
      setError('Erro ao alterar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.scene}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Troca de senha obrigatória</h2>
        <InputField
          id="password"
          label="Nova senha"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <InputField
          id="confirm"
          label="Confirme a nova senha"
          type="password"
          value={confirm}
          onChange={setConfirm}
          required
        />

        {needsSecurityQuestion && (
          <>
            <p className={styles.hint}>Defina uma pergunta de segurança para poder recuperar sua senha no futuro.</p>
            <div className={styles.selectWrapper}>
              <label htmlFor="securityQuestion">Pergunta de segurança</label>
              <select
                id="securityQuestion"
                className={styles.select}
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <InputField
              id="securityAnswer"
              label="Resposta"
              placeholder="Sua resposta secreta"
              value={securityAnswer}
              onChange={setSecurityAnswer}
              required
            />
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" full disabled={loading}>Alterar senha</Button>
      </form>
    </section>
  )
}
