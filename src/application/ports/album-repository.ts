import type { Album, AlbumId } from '../../domain/album/album.types'

export interface AlbumRepository {
  getAlbums(): Promise<Album[]>
  getAlbumById(id: AlbumId): Promise<Album | undefined>
  createAlbum(album: Album): Promise<Album>
  updateAlbum(album: Album): Promise<Album>
}
