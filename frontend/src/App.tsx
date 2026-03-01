import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { LoginPage } from './pages/Login/LoginPage'
import { UsersPage } from './pages/Users/UsersPage'
import { ProtectedRoute } from './components/navigation/ProtectedRoute'
import { ConfirmDialogProvider } from './providers/ConfirmDialogProvider'
import { ChangePasswordPage } from './pages/ChangePassword/ChangePasswordPage'
import { ForgotPasswordPage } from './pages/ForgotPassword/ForgotPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfirmDialogProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
                   <Route element={<ProtectedRoute />}>
                     <Route path="/" element={<UsersPage />} />
                     <Route path="trocar-senha" element={<ChangePasswordPage />} />
                   </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConfirmDialogProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
