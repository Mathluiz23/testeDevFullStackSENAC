import type { FormEvent } from 'react'
import { useState} from 'react'
import { Button } from '../../../components/ui/Button'
import { InputField } from '../../../components/ui/InputField'
import { SelectField } from '../../../components/ui/SelectField'
import { InlineMessage } from '../../../components/feedback/InlineMessage'
import type { RoleOption, UserModel, UserPayload } from '../../../types'
import { formatCpf, onlyDigits } from '../../../utils/ValidatedCPF'
import styles from './UserForm.module.css'

type Props = {
  roles: RoleOption[]
  mode: 'create' | 'edit'
  editingUser?: Pick<UserModel, 'name' | 'email' | 'cpfFormatted' | 'roleLabel' | 'roleDescription'> | null
  disabled?: boolean
  initialValues?: Partial<UserPayload> & { cpfFormatted?: string }
  onSubmit: (payload: UserPayload) => Promise<void>
  onCancel?: () => void
}

export const UserForm = ({ roles, mode, disabled, initialValues, onSubmit, onCancel, editingUser }: Props) => {
  const [formValues, setFormValues] = useState(() => ({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    cpf: formatCpf(initialValues?.cpfFormatted ?? initialValues?.cpf ?? ''),
    role: initialValues?.role ?? (roles[0]?.value ?? 3),
    password: '',
  }))
  const [message, setMessage] = useState<string | null>(null)

  const updateField = (field: string, value: string | number) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (disabled) return
    if (mode === 'create' && (!formValues.password || formValues.password.trim().length === 0)) {
      setMessage('A senha é obrigatória para cadastro.')
      return
    }

    try {
      await onSubmit({
        name: formValues.name,
        email: formValues.email,
        cpf: onlyDigits(formValues.cpf),
        role: Number(formValues.role),
        password: formValues.password,
      })

      setMessage(mode === 'create' ? 'Usuário cadastrado com sucesso.' : 'Alterações salvas!')
      setFormValues({
        name: '',
        email: '',
        cpf: '',
        role: roles[0]?.value ?? 3,
        password: '',
      })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível salvar os dados.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <div>
          <p>{mode === 'create' ? 'Cadastrar usuário' : 'Editar usuário'}</p>
        </div>
        {mode === 'edit' && onCancel && (
          <button type="button" className={styles.reset} onClick={onCancel} disabled={disabled}>
            Cancelar edição
          </button>
        )}
      </div>

      {mode === 'edit' && editingUser && (
        <section className={styles.editContext}>
          <div className={styles.contextMain}>
            <span className={styles.contextLabel}>Editando</span>
            <strong className={styles.contextName}>{editingUser.name}</strong>
            <p className={styles.contextRole}>{editingUser.roleLabel}</p>
          </div>
          <div className={styles.contextDetails}>
            <div className={styles.contextInfo}>
              <span className={styles.contextLabel}>E-mail</span>
              <p>{editingUser.email}</p>
            </div>
            <div className={styles.contextInfo}>
              <span className={styles.contextLabel}>CPF</span>
              <p>{editingUser.cpfFormatted}</p>
            </div>
          </div>
          {editingUser.roleDescription && <p className={styles.contextHint}>{editingUser.roleDescription}</p>}
        </section>
      )}

      {message && (
        <InlineMessage tone={message.includes('sucesso') || message.includes('salvas') ? 'success' : 'danger'} message={message} />
      )}

      <div className={styles.grid}>
        <InputField
          id="name"
          label="Nome completo"
          value={formValues.name}
          onChange={(value) => updateField('name', value)}
          placeholder="Digite o nome"
          required
          disabled={disabled}
        />
        <InputField
          id="email"
          label="E-mail corporativo"
          type="email"
          value={formValues.email}
          onChange={(value) => updateField('email', value)}
          placeholder="nome@senacrs.com.br"
          required
          disabled={disabled}
        />
        <InputField
          id="cpfField"
          label="CPF"
          value={formValues.cpf}
          onChange={(value) => updateField('cpf', formatCpf(value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          required
          disabled={disabled}
        />
        <SelectField
          id="role"
          label="Permissão"
          value={formValues.role}
          onChange={(event) => updateField('role', Number(event.target.value))}
          options={roles}
          disabled={disabled}
        />
        <InputField
          id="password"
          label="Senha de acesso"
          type="password"
          value={formValues.password}
          onChange={(value) => updateField('password', value)}
          placeholder={mode === 'edit' ? 'Digite uma nova senha' : 'Crie uma senha segura'}
          required={mode === 'create'}
          disabled={disabled}
        />
      </div>

      <Button type="submit" full disabled={disabled}>
        {mode === 'create' ? 'Cadastrar usuário' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
