import { afterEach, describe, expect, it, vi } from 'vitest'
import { YouTubePlaylistProvider } from './youtube-playlist-provider'

describe('YouTubePlaylistProvider', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('imports playlist metadata, tracks, durations and video links', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [{ snippet: { title: 'Live Sessions', channelTitle: 'Artist Channel', thumbnails: { high: { url: 'https://img.test/cover.jpg' } } } }] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [{ contentDetails: { videoId: 'video-one' }, snippet: { title: 'First Song' } }] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [{ id: 'video-one', contentDetails: { duration: 'PT1H2M3S' } }] })))

    const album = await new YouTubePlaylistProvider().importYouTubePlaylist('https://www.youtube.com/playlist?list=playlist-one')

    expect(album.title).toBe('Live Sessions')
    expect(album.artist).toBe('Artist Channel')
    expect(album.artworkUrl).toBe('https://img.test/cover.jpg')
    expect(album.genre).toBe('Unknown genre')
    expect(album.releaseYear).toBe(0)
    expect(album.tracks).toEqual([{ title: 'First Song', duration: '1:02:03', youtubeUrl: 'https://www.youtube.com/watch?v=video-one' }])
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('rejects invalid playlist URLs and missing configuration', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', '')
    await expect(new YouTubePlaylistProvider().importYouTubePlaylist('https://example.com/list=bad')).rejects.toThrow('not configured')

    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key')
    await expect(new YouTubePlaylistProvider().importYouTubePlaylist('https://www.youtube.com/watch?v=video')).rejects.toThrow('valid YouTube playlist URL')
  })
})
