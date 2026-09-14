import type { Album, Track } from './album.types'

export function calculateAlbumRating(album: Album): number | undefined {
  const ratedTracks = album.tracks.filter((track): track is Track & { rating: number } => track.rating !== undefined)
  if (ratedTracks.length === 0) return undefined

  const average = ratedTracks.reduce((total, track) => total + track.rating, 0) / ratedTracks.length
  return Math.round(average * 2) / 2
}