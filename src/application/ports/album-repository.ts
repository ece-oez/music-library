import type { Album, AlbumId } from '../../domain/album/album.types'

export interface AlbumRepository {
  getAlbums(): Promise<Album[]>
  getAlbumById(id: AlbumId): Promise<Album | undefined>
}
