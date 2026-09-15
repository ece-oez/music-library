import type { Album, Track } from './album.types'

export function getTrackRating(track: Track, userId?: string): number | undefined {
  if (userId) return track.ratings?.find((rating) => rating.userId === userId)?.value
  return track.ratings?.[0]?.value ?? track.rating
}

export function calculateAlbumRating(album: Album): number | undefined {
  const ratings = album.tracks.flatMap((track) => track.ratings?.map((rating) => rating.value) ?? (track.rating !== undefined ? [track.rating] : []))
  if (ratings.length === 0) return undefined

  const average = ratings.reduce((total, rating) => total + rating, 0) / ratings.length
  return Math.round(average * 2) / 2
}