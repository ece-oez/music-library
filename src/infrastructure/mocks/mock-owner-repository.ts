import type { Owner, OwnerId } from '../../domain/collection-item/collection-item.types'
import type { OwnerRepository } from '../../application/ports/owner-repository'
import { mockOwners } from './mock-data'

export class MockOwnerRepository implements OwnerRepository {
  async getOwners(): Promise<Owner[]> {
    return mockOwners
  }

  async getOwnerById(id: OwnerId): Promise<Owner | undefined> {
    return mockOwners.find((owner) => owner.id === id)
  }
}
