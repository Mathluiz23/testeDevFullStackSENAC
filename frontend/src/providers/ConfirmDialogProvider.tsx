import { useCallback, useState, type ReactNode } from 'react'
import { ConfirmDialog } from '../components/feedback/ConfirmDialog'

type ConfirmDialogOptions = {
  title?: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'neutral' | 'danger'
}

type ConfirmDialogHandler = (options: ConfirmDialogOptions) => Promise<boolean>

import { ConfirmDialogContext } from '../contexts/ConfirmDialogContext'

type Props = {
  children: ReactNode
}

type DialogState = {
  options: ConfirmDialogOptions
  resolve: (value: boolean) => void
}

export const ConfirmDialogProvider = ({ children }: Props) => {
  const [state, setState] = useState<DialogState | null>(null)

  const confirm = useCallback<ConfirmDialogHandler>((options) =>
    new Promise((resolve) => {
      setState({
        options: {
          cancelLabel: 'Cancelar',
          confirmLabel: 'Confirmar',
          tone: 'neutral',
          ...options,
        },
        resolve,
      })
    }), [])

  const handleClose = (result: boolean) => {
    if (!state) return
    state.resolve(result)
    setState(null)
  }

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={Boolean(state)}
        title={state?.options.title}
        message={state?.options.message}
        confirmLabel={state?.options.confirmLabel}
        cancelLabel={state?.options.cancelLabel}
        tone={state?.options.tone}
        onCancel={() => handleClose(false)}
        onConfirm={() => handleClose(true)}
      />
    </ConfirmDialogContext.Provider>
  )
}

