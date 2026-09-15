export type ImportedTrack = {
  title: string
  duration: string
  youtubeUrl: string
}

export type ImportedAlbum = {
  title: string
  artist: string
  releaseYear: number
  genre: string
  artworkUrl?: string
  tracks: ImportedTrack[]
}

export interface MusicProvider {
  importYouTubePlaylist(url: string): Promise<ImportedAlbum>
}
