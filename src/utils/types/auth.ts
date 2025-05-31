import type { User } from "./interface"

const STORAGE_KEY = "epiai_user"

export class AuthService {
  // Salvar usuário no localStorage
  static login(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    // TODO: Integração futura com API
    // - Salvar token JWT
    // - Configurar interceptors para requisições
    // - Implementar refresh token
    // - Sincronizar com backend
  }

  // Recuperar usuário do localStorage
  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error)
      return null
    }
  }

  // Remover usuário do localStorage
  static logout(): void {
    localStorage.removeItem(STORAGE_KEY)

    // TODO: Integração futura com API
    // - Invalidar token no backend
    // - Limpar cache de dados
    // - Redirecionar para login
  }

  // Verificar se usuário está autenticado
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  // Verificar se usuário é admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.type === "admin"
  }

  // Verificar se usuário é operário
  static isWorker(): boolean {
    const user = this.getCurrentUser()
    return user?.type === "worker"
  }
}
