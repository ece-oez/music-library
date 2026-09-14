import type { Owner, OwnerId } from '../../domain/collection-item/collection-item.types'

export interface OwnerRepository {
  getOwners(): Promise<Owner[]>
  getOwnerById(id: OwnerId): Promise<Owner | undefined>
}
