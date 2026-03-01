import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { InputField } from '../../components/ui/InputField'
import { InlineMessage } from '../../components/feedback/InlineMessage'
import { formatCpf } from '../../utils/ValidatedCPF'
import api from '../../services/api'
import styles from './ForgotPasswordPage.module.css'

type Step = 'cpf' | 'question' | 'success'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('cpf')
  const [cpf, setCpf] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCpfSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    const cpfDigits = cpf.replace(/\D/g, '')
    if (cpfDigits.length !== 11) {
      setError('Informe um CPF válido com 11 dígitos.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post<{ user_id: number; security_question: string }>('/forgot-password/question', { cpf: cpfDigits })
      setUserId(data.user_id)
      setQuestion(data.security_question)
      setStep('question')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Usuário não encontrado ou sem pergunta de segurança cadastrada. Entre em contato com um administrador.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    if (!answer.trim()) {
      setError('Digite a resposta da pergunta de segurança.')
      return
    }
    if (newPassword.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)
    try {
      await api.post('/forgot-password/verify', {
        user_id: userId,
        security_answer: answer,
        new_password: newPassword,
      })
      setStep('success')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Resposta incorreta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.scene}>
      <div className={styles.card}>
        {step === 'cpf' && (
          <form onSubmit={handleCpfSubmit} className={styles.form}>
            <h2>Recuperar senha</h2>
            <p className={styles.description}>
              Informe o CPF cadastrado para verificar sua identidade.
            </p>
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
            {error && <InlineMessage tone="danger" message={error} />}
            <Button type="submit" full loading={loading}>Continuar</Button>
            <button type="button" className={styles.backLink} onClick={() => navigate('/login')}>
              Voltar para o login
            </button>
          </form>
        )}

        {step === 'question' && (
          <form onSubmit={handleAnswerSubmit} className={styles.form}>
            <h2>Pergunta de segurança</h2>
            <div className={styles.questionBox}>
              <span className={styles.questionLabel}>Sua pergunta:</span>
              <p className={styles.questionText}>{question}</p>
            </div>
            <InputField
              id="answer"
              label="Sua resposta"
              placeholder="Digite a resposta"
              value={answer}
              onChange={setAnswer}
              required
            />
            <InputField
              id="newPassword"
              label="Nova senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={newPassword}
              onChange={setNewPassword}
              required
            />
            <InputField
              id="confirmPassword"
              label="Confirme a nova senha"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
            {error && <InlineMessage tone="danger" message={error} />}
            <Button type="submit" full loading={loading}>Redefinir senha</Button>
            <button type="button" className={styles.backLink} onClick={() => { setStep('cpf'); setError(null) }}>
              Voltar
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className={styles.form}>
            <h2>Senha alterada!</h2>
            <InlineMessage tone="success" message="Sua senha foi alterada com sucesso. Faça login com a nova senha." />
            <Button full onClick={() => navigate('/login')}>Ir para o login</Button>
          </div>
        )}
      </div>
    </section>
  )
}
