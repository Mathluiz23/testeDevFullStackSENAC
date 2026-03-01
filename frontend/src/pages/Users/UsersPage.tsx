import { useEffect, useState } from 'react'
import { TopBar } from '../../components/layout/TopBar'
import { InlineMessage } from '../../components/feedback/InlineMessage'
import { UserCard } from '../../components/users/UserCard'
import { UserForm } from './components/UserForm'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import type { RoleOption, UserModel, UserPayload } from '../../types'
import styles from './UsersPage.module.css'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { Modal } from '../../components/feedback/Modal'

export const UsersPage = () => {
  const { user, setUser, permissions, logout } = useAuth()
  const confirm = useConfirmDialog()
  const [users, setUsers] = useState<UserModel[]>([])
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [editUser, setEditUser] = useState<UserModel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const canCreate = Boolean(permissions?.create)
  const canEdit = Boolean(permissions?.edit)
  const canDelete = Boolean(permissions?.delete)
  const createDisabled = !canCreate
  const formMessage = !canCreate
    ? 'Você não possui permissão para cadastrar novos usuários.'
    : null

  useEffect(() => {
    const load = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          userService.list(),
          userService.roles(),
        ])
        setUsers(usersResponse)
        setRoles(rolesResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleCreate = async (payload: UserPayload) => {
    if (!canCreate) {
      throw new Error('Seu usuário não possui permissão para criar registros.')
    }

    const created = await userService.create(payload)
    setUsers((current) => [created, ...current])
  }

  const handleUpdate = async (payload: UserPayload) => {
    if (!canEdit || !editUser) {
      throw new Error('Você não pode editar usuários neste momento.')
    }
    const updated = await userService.update(editUser.id, payload)
    setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    if (user && editUser && user.id === editUser.id) {
      setUser(updated)
    }
    setEditUser(null)
  }

  const handleEdit = (userToEdit: UserModel) => {
    if (!canEdit) return
    setEditUser(userToEdit)
  }

  const handleDelete = async (userToDelete: UserModel) => {
    if (!canDelete) return
    const confirmed = await confirm({
      title: 'Excluir usuário',
      message: `Tem certeza que deseja excluir o usuário ${userToDelete.name}? Essa ação não poderá ser desfeita.`,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      tone: 'danger',
    })
    if (!confirmed) return
    await userService.remove(userToDelete.id)
    setUsers((current) => current.filter((item) => item.id !== userToDelete.id))
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout().catch(() => null)
  }

  return (
    <div className={styles.wrapper}>
      <TopBar name={user.name} roleLabel={user.roleLabel} onLogout={handleLogout} />

      <div className="fade-in" style={{ animationDelay: '0.1s' }}>
        {formMessage && <InlineMessage tone="info" message={formMessage} />}
        <UserForm
          roles={roles}
          mode="create"
          disabled={createDisabled}
          onSubmit={handleCreate}
        />
      </div>

      {error && <InlineMessage tone="danger" message={error} />}

      <section className={styles.listSection}>
        <header>
          <p>Usuários cadastrados</p>
          <span>{users.length} registros ativos</span>
        </header>

        {loading ? (
          <div className="fullscreen-loader" style={{ minHeight: '40vh' }}>
            <span className="spinner" />
            <p>Carregando usuários...</p>
          </div>
        ) : (
          <div className={styles.list}>
            {users.map((item) => (
              <UserCard key={item.id} user={item} onEdit={permissions?.edit ? handleEdit : undefined} onDelete={permissions?.delete ? handleDelete : undefined} />
            ))}
          </div>
        )}
      </section>

      <Modal
        open={Boolean(editUser)}
        title="Editar usuário"
        description="Atualize dados sensíveis com atenção. As alterações são aplicadas imediatamente."
        onClose={() => setEditUser(null)}
        size="large"
      >
        {editUser && (
          <UserForm
            key={editUser.id}
            roles={roles}
            mode="edit"
            disabled={!canEdit}
            initialValues={{
              name: editUser.name,
              email: editUser.email,
              cpf: editUser.cpf,
              cpfFormatted: editUser.cpfFormatted,
              role: editUser.role,
            }}
            editingUser={{
              name: editUser.name,
              email: editUser.email,
              cpfFormatted: editUser.cpfFormatted,
              roleLabel: editUser.roleLabel,
              roleDescription: editUser.roleDescription,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditUser(null)}
          />
        )}
      </Modal>

    </div>
  )
}
