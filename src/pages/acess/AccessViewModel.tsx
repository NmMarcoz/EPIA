"use client"

import type React from "react"

import { useState, useRef } from "react"
import { toast } from "react-toastify"
import type { AuthMode, User, AccessProps } from "./AccessModel"

export const useAccessViewModel = ({ onLoginSuccess, handleWorker }: AccessProps) => { 
  const [authMode, setAuthMode] = useState<AuthMode>("operator")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [scanningStatus, setScanningStatus] = useState("Aguardando cartão ou QR Code...")

  const handleAdminLogin = async (e: React.FormEvent) => { //função que lida com o login do admin
    e.preventDefault()
    setIsLoading(true)

    try {
      if (email === "admin@epia.com" && password === "admin123") {
        const adminUser: User = {
          id: 1,
          name: "Administrador EPIA",
          type: "admin",
          email: email,
        }
        onLoginSuccess!(adminUser)
      } else {
        alert("Credenciais inválidas! Use: admin@epia.com / admin123")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOperatorAccess = async () => {   //função que lida com o acesso do operário
    setScanningStatus("Processando...")
    setIsLoading(true)

    setTimeout(async () => {
      const worker = await handleWorker!().catch((error) => {
        console.error("Erro ao buscar trabalhador:", error)
        toast.error("Falha ao autenticar, verifique o cartão")
        setIsLoading(false)
        return
      })
      onLoginSuccess!(worker!)
      setIsLoading(false)
    }, 1000)
  }

  const handleAuthModeChange = (mode: AuthMode) => {   //função que lida com a mudança do modo de autenticação
    setAuthMode(mode)
  }

  const handleEmailChange = (newEmail: string) => {  //função que lida com a mudança do email
    setEmail(newEmail)
  }

  const handlePasswordChange = (newPassword: string) => {  //função que lida com a mudança da senha
    setPassword(newPassword)
  }

  return {   //retorna as propriedades e funções necessárias para a view
    authMode,
    email,
    password,
    isLoading,
    isWebcamActive,
    scanningStatus,
    videoRef,
    onAuthModeChange: handleAuthModeChange,
    onEmailChange: handleEmailChange,
    onPasswordChange: handlePasswordChange,
    onAdminLogin: handleAdminLogin,
    onOperatorAccess: handleOperatorAccess,
  }
}
