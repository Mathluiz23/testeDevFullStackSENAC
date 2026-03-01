export type PermissionSet = {
  view: boolean
  edit: boolean
  delete: boolean
  create: boolean
}

export type RoleOption = {
  value: number
  label: string
  description: string
}

export type UserModel = {
  id: number
  name: string
  email: string
  cpf: string
  cpfFormatted: string
  role: number
  roleLabel: string
  roleDescription: string
  mustChangePassword?: boolean
  hasSecurityQuestion?: boolean
  createdAt?: string
  updatedAt?: string
  actions: {
    canEdit: boolean
    canDelete: boolean
  }
}

export type AuthResponse = {
  token: string
  user: UserModel
  permissions: PermissionSet
}

export type ProfileResponse = {
  user: UserModel
  permissions: PermissionSet
}

export type UserPayload = {
  name: string
  email: string
  cpf: string
  role: number
  password?: string
}
