import { useContext } from 'react'
import { ConfirmDialogContext } from '../contexts/ConfirmDialogContext'

export const useConfirmDialog = () => {
  const handler = useContext(ConfirmDialogContext)
  if (!handler) {
    throw new Error('useConfirmDialog deve ser usado dentro de ConfirmDialogProvider')
  }
  return handler
}
