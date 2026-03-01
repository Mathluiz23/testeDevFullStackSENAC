import { createContext } from 'react'
import type { ConfirmDialogHandler } from '../providers/ConfirmDialogProvider'

export const ConfirmDialogContext = createContext<ConfirmDialogHandler | undefined>(undefined)
