import type { AlbumRepository } from '../application/ports/album-repository'
import type { CollectionItemRepository } from '../application/ports/collection-item-repository'
import type { OwnerRepository } from '../application/ports/owner-repository'
import type { MusicProvider } from '../application/ports/music-provider'
import { MockAlbumRepository } from './mocks/mock-album-repository'
import { MockCollectionItemRepository } from './mocks/mock-collection-item-repository'
import { MockOwnerRepository } from './mocks/mock-owner-repository'
import { YouTubePlaylistProvider } from './music-providers/youtube-playlist-provider'

export type Repositories = {
  albums: AlbumRepository
  collectionItems: CollectionItemRepository
  owners: OwnerRepository
  music: MusicProvider
}

export const repositories: Repositories = {
  albums: new MockAlbumRepository(),
  collectionItems: new MockCollectionItemRepository(),
  owners: new MockOwnerRepository(),
  music: new YouTubePlaylistProvider(),
}
