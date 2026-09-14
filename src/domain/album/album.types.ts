export type AlbumId = string
export type ArtistId = string
export type GenreId = string
export type TagId = string

export type Artist = {
  id: ArtistId
  name: string
}

export type Genre = {
  id: GenreId
  name: string
}

export type Tag = {
  id: TagId
  name: string
}

export type Artwork = {
  url: string
  alt: string
  source: 'mock'
}

export type Track = {
  id: string
  title: string
  duration: string
  rating?: number
}

export type MediaLink = {
  id: string
  url: string
  label: string
  trackId?: string
}

export type AlbumRating = 1 | 2 | 3 | 4 | 5

export type Album = {
  id: AlbumId
  title: string
  artists: Artist[]
  releaseYear: number
  genres: Genre[]
  tags: Tag[]
  artwork: Artwork
  tracks: Track[]
  mediaLinks: MediaLink[]
  rating?: AlbumRating
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}
