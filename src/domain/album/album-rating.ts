import type { Album, AlbumRating } from './album.types'

export function calculateAlbumRating(album: Album): number | undefined {
  const ratedTracks = album.tracks.filter((track): track is typeof track & { rating: AlbumRating } => track.rating !== undefined)
  if (ratedTracks.length === 0) return undefined

  const average = ratedTracks.reduce((total, track) => total + track.rating, 0) / ratedTracks.length
  return Math.round(average * 2) / 2
}