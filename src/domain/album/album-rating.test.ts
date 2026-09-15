import { describe, expect, it } from 'vitest'
import { calculateAlbumRating, getTrackRating } from './album-rating'
import type { Album } from './album.types'

const album = (ratings: (1 | 2 | 3 | 4 | 5 | undefined)[]): Album => ({
  id: 'album-test',
  title: 'Test album',
  artists: [],
  releaseYear: 2025,
  genres: [],
  tags: [],
  artwork: { url: 'https://example.com/art.jpg', alt: 'Test artwork', source: 'mock' },
  tracks: ratings.map((rating, index) => ({ id: `track-${index}`, title: `Track ${index}`, duration: '3:00', rating })),
  mediaLinks: [],
  isFavorite: false,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
})

describe('calculateAlbumRating', () => {
  it('averages only rated tracks and rounds to a half star', () => {
    expect(calculateAlbumRating(album([5, 4, undefined]))).toBe(4.5)
    expect(calculateAlbumRating(album([5, 4, 3]))).toBe(4)
  })

  it('returns undefined when no track has been rated', () => {
    expect(calculateAlbumRating(album([undefined, undefined]))).toBeUndefined()
  })

  it('keeps ratings from different users on the same track', () => {
    const sharedTrackAlbum = album([undefined])
    sharedTrackAlbum.tracks[0].ratings = [
      { userId: 'user-you', value: 5 },
      { userId: 'user-mara', value: 2 },
    ]

    expect(getTrackRating(sharedTrackAlbum.tracks[0], 'user-you')).toBe(5)
    expect(getTrackRating(sharedTrackAlbum.tracks[0], 'user-mara')).toBe(2)
    expect(calculateAlbumRating(sharedTrackAlbum)).toBe(3.5)
  })
})