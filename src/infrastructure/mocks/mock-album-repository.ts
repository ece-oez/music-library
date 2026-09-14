import type { AlbumRepository } from '../../application/ports/album-repository'
import type { Album, AlbumId } from '../../domain/album/album.types'
import { mockAlbums } from './mock-data'

const delay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
}

export class MockAlbumRepository implements AlbumRepository {
  private albums = [...mockAlbums]

  async getAlbums(): Promise<Album[]> {
    await delay()
    return [...this.albums]
  }

  async getAlbumById(id: AlbumId): Promise<Album | undefined> {
    await delay()
    return this.albums.find((album) => album.id === id)
  }

  async createAlbum(album: Album): Promise<Album> {
    await delay()
    this.albums.push(album)
    return album
  }

  async updateAlbum(album: Album): Promise<Album> {
    await delay()
    this.albums = this.albums.map((currentAlbum) => currentAlbum.id === album.id ? album : currentAlbum)
    return album
  }
}
