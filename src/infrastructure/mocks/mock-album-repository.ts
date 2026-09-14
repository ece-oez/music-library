import type { AlbumRepository } from '../../application/ports/album-repository'
import type { Album, AlbumId } from '../../domain/album/album.types'
import { mockAlbums } from './mock-data'

const delay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
}

export class MockAlbumRepository implements AlbumRepository {
  async getAlbums(): Promise<Album[]> {
    await delay()
    return mockAlbums
  }

  async getAlbumById(id: AlbumId): Promise<Album | undefined> {
    await delay()
    return mockAlbums.find((album) => album.id === id)
  }
}
