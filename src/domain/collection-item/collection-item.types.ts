import type { AlbumId } from '../album/album.types'

export type CollectionItemId = string
export type OwnerId = string

export type Owner = {
  id: OwnerId
  name: string
  initials: string
  accent: string
}

export type MediaType = 'vinyl' | 'cd'
export type Condition = 'mint' | 'near-mint' | 'very-good' | 'good' | 'fair'

export type Money = {
  amount: number
  currency: 'EUR'
}

export type PhysicalPhoto = {
  url: string
  alt: string
}

export type CollectionItem = {
  id: CollectionItemId
  albumId: AlbumId
  mediaType: MediaType
  ownerId: OwnerId
  condition: Condition
  purchasePrice?: Money
  physicalPhoto?: PhysicalPhoto
  notes?: string
  acquiredAt?: string
  createdAt: string
  updatedAt: string
}
