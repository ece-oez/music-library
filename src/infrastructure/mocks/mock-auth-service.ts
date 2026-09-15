import type { AuthService } from '../../application/ports/auth-service'
import type { User } from '../../domain/auth/auth.types'

const users: Array<User & { password: string }> = [
  { id: 'user-you', username: 'you', password: 'tracks', displayName: 'You', initials: 'YO', accent: '#d95d39' },
  { id: 'user-mara', username: 'mara', password: 'plates', displayName: 'Mara', initials: 'MA', accent: '#3e7c78' },
]

const sessionKey = 'tracks-n-plates-user'

export class MockAuthService implements AuthService {
  async signIn(username: string, password: string): Promise<User> {
    const user = users.find((candidate) => candidate.username === username && candidate.password === password)
    if (!user) throw new Error('Invalid username or password.')
    const sessionUser: User = { id: user.id, username: user.username, displayName: user.displayName, initials: user.initials, accent: user.accent }
    localStorage.setItem(sessionKey, JSON.stringify(sessionUser))
    return sessionUser
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(sessionKey)
  }

  getCurrentUser(): User | undefined {
    const storedUser = localStorage.getItem(sessionKey)
    if (!storedUser) return undefined
    try {
      return JSON.parse(storedUser) as User
    } catch {
      localStorage.removeItem(sessionKey)
      return undefined
    }
  }
}
