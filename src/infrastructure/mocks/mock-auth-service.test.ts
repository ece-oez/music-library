import { beforeEach, describe, expect, it } from 'vitest'
import { MockAuthService } from './mock-auth-service'

describe('MockAuthService', () => {
  beforeEach(() => localStorage.clear())

  it('signs in both demo users and restores the active session', async () => {
    const service = new MockAuthService()
    const you = await service.signIn('you', 'tracks')

    expect(you.displayName).toBe('You')
    expect(service.getCurrentUser()?.id).toBe('user-you')

    await service.signOut()
    const mara = await service.signIn('mara', 'plates')
    expect(mara.displayName).toBe('Mara')
    expect(service.getCurrentUser()?.id).toBe('user-mara')
  })

  it('rejects invalid credentials', async () => {
    await expect(new MockAuthService().signIn('you', 'wrong')).rejects.toThrow('Invalid username or password.')
  })
})