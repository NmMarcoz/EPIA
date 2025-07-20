import type React from "react"
import type { Worker } from "../../utils/types/EpiaTypes"

export interface User {
  id: number | string
  name: string
  type: "operator" | "admin"
  email?: string
  cardId?: string
}

export interface AccessProps { 
  onLoginSuccess?: (worker: Worker | User) => void
  handleWorker?: () => Promise<Worker>
}

export type AuthMode = "operator" | "admin"

export interface AccessViewProps { // Propriedades necessárias para a visualização de acesso
  authMode: AuthMode
  email: string
  password: string
  isLoading: boolean
  isWebcamActive: boolean
  scanningStatus: string
  videoRef: React.RefObject<HTMLVideoElement>
  onAuthModeChange: (mode: AuthMode) => void
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onAdminLogin: (e: React.FormEvent) => void
  onOperatorAccess: () => void
}
