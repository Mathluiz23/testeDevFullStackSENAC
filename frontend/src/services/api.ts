import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  timeout: 10_000,
})

let authToken: string | null = null

const messageDictionary: Record<string, string> = {
  'These credentials do not match our records.': 'CPF ou senha inválidos. Verifique os dados e tente novamente.',
  'Too Many Attempts.': 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.',
  'The given data was invalid.': 'Os dados informados são inválidos.',
  'Unauthenticated.': 'Sua sessão expirou. Faça login novamente para continuar.',
  'Unauthorized.': 'Você não tem permissão para executar esta ação.',
  'Server Error': 'Erro interno no servidor. Tente novamente em instantes.',
  'SQLSTATE[23000]': 'Já existe um usuário com este e-mail ou CPF. Verifique os dados e tente novamente.',
  'Integrity constraint violation': 'Já existe um usuário com este e-mail ou CPF. Verifique os dados e tente novamente.',
  'NOT NULL constraint failed': 'Preencha todos os campos obrigatórios corretamente.',
}

const translateMessage = (message?: string, fallback = 'Não foi possível completar a solicitação.') => {
  if (!message) return fallback
  const normalized = message.trim()
  return messageDictionary[normalized] ?? normalized
}

export const setAuthToken = (token: string | null) => {
  authToken = token
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallback = 'Não foi possível completar a solicitação.'

    if (error.response?.data?.message) {
      return Promise.reject(new Error(translateMessage(error.response.data.message, fallback)))
    }

    if (error.response?.data?.errors) {
      const [firstError] = Object.values(error.response.data.errors)
      if (Array.isArray(firstError)) {
        return Promise.reject(new Error(translateMessage(firstError[0] as string, fallback)))
      }
    }

    return Promise.reject(new Error(translateMessage(error.message, fallback)))
  }
)

export default api
