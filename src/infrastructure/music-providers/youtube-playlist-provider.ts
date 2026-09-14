import type { ImportedAlbum, ImportedTrack, MusicProvider } from '../../application/ports/music-provider'

type YouTubeResponse<T> = {
  items?: T[]
  nextPageToken?: string
  error?: { message?: string }
}

type PlaylistSnippet = {
  title?: string
  channelTitle?: string
  thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } }
}

type PlaylistItem = {
  contentDetails?: { videoId?: string }
  snippet?: { title?: string }
}

type VideoDetails = {
  id?: string
  contentDetails?: { duration?: string }
}

const apiBaseUrl = 'https://www.googleapis.com/youtube/v3'

function getPlaylistId(url: string): string | undefined {
  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.hostname.includes('youtube.com')) return undefined
    return parsedUrl.searchParams.get('list') ?? undefined
  } catch {
    return undefined
  }
}

function formatDuration(value: string | undefined): string {
  if (!value) return 'Unknown duration'
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return 'Unknown duration'
  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  if (totalSeconds === 0) return 'Unknown duration'
  const formattedSeconds = String(totalSeconds % 60).padStart(2, '0')
  const formattedMinutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${formattedMinutes}:${formattedSeconds}` : `${Math.floor(totalSeconds / 60)}:${formattedSeconds}`
}

export class YouTubePlaylistProvider implements MusicProvider {
  private readonly apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined

  async importYouTubePlaylist(url: string): Promise<ImportedAlbum> {
    if (!this.apiKey) throw new Error('YouTube import is not configured. Add VITE_YOUTUBE_API_KEY to your environment.')
    const playlistId = getPlaylistId(url)
    if (!playlistId) throw new Error('Enter a valid YouTube playlist URL containing a list parameter.')

    const playlist = await this.request<{ snippet?: PlaylistSnippet }>('playlists', { part: 'snippet', id: playlistId })
    const playlistSnippet = playlist.items?.[0]?.snippet
    if (!playlistSnippet) throw new Error('The YouTube playlist could not be found or is private.')

    const playlistItems = await this.getAllPlaylistItems(playlistId)
    const videoIds = playlistItems.map((item) => item.contentDetails?.videoId).filter((id): id is string => Boolean(id))
    const videoDetails = await this.getVideoDetails(videoIds)
    const durations = new Map(videoDetails.map((video) => [video.id, video.contentDetails?.duration]))
    const tracks: ImportedTrack[] = playlistItems
      .map((item) => {
        const videoId = item.contentDetails?.videoId
        if (!videoId) return undefined
        return {
          title: item.snippet?.title?.trim() || 'Untitled track',
          duration: formatDuration(durations.get(videoId)),
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        }
      })
      .filter((track): track is ImportedTrack => Boolean(track))

    return {
      title: playlistSnippet.title?.trim() || 'Untitled album',
      artist: playlistSnippet.channelTitle?.trim() || 'Unknown artist',
      releaseYear: 0,
      genre: 'Unknown genre',
      artworkUrl: playlistSnippet.thumbnails?.high?.url ?? playlistSnippet.thumbnails?.medium?.url ?? playlistSnippet.thumbnails?.default?.url,
      tracks,
    }
  }

  private async getAllPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
    const items: PlaylistItem[] = []
    let pageToken: string | undefined
    do {
      const response = await this.request<PlaylistItem>('playlistItems', { part: 'snippet,contentDetails', playlistId, maxResults: '50', pageToken })
      items.push(...(response.items ?? []))
      pageToken = response.nextPageToken
    } while (pageToken)
    return items
  }

  private async getVideoDetails(videoIds: string[]): Promise<VideoDetails[]> {
    if (videoIds.length === 0) return []
    const response = await this.request<VideoDetails>('videos', { part: 'contentDetails', id: videoIds.join(',') })
    return response.items ?? []
  }

  private async request<T>(resource: string, params: Record<string, string | undefined>): Promise<YouTubeResponse<T>> {
    const searchParams = new URLSearchParams({ key: this.apiKey ?? '' })
    Object.entries(params).forEach(([key, value]) => { if (value) searchParams.set(key, value) })
    const response = await fetch(`${apiBaseUrl}/${resource}?${searchParams.toString()}`)
    const body = await response.json() as YouTubeResponse<T>
    if (!response.ok) throw new Error(body.error?.message || 'The YouTube request failed.')
    return body
  }
}
