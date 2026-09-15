import { useState, type PropsWithChildren } from 'react'
import type { User } from '../../domain/auth/auth.types'
import { repositories } from '../../infrastructure/repositories'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(() => repositories.auth.getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)

  async function signIn(username: string, password: string) {
    setIsLoading(true)
    try {
      setUser(await repositories.auth.signIn(username, password))
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    await repositories.auth.signOut()
    setUser(undefined)
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}
