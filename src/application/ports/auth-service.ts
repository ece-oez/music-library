import type { User } from '../../domain/auth/auth.types'

export interface AuthService {
  signIn(username: string, password: string): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): User | undefined
}
