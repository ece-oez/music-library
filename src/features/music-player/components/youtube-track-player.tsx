import { useEffect, useMemo, useRef, useState } from 'react'
import type { MediaLink, Track } from '../../../domain/album/album.types'
import { RatingStars } from '../../../shared/components/rating-stars'

type YouTubeTrackPlayerProps = {
  tracks: Track[]
  mediaLinks: MediaLink[]
}

type YouTubePlayerEvent = { data: number }
type YouTubePlayer = { destroy: () => void; loadVideoById: (videoId: string) => void }
type YouTubePlayerConstructor = new (element: HTMLElement, options: { host: string; videoId: string; playerVars: { autoplay: number; origin: string; rel: number }; events: { onStateChange: (event: YouTubePlayerEvent) => void } }) => YouTubePlayer

declare global {
  interface Window {
    YT?: { Player: YouTubePlayerConstructor; PlayerState: { ENDED: number } }
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<void> | undefined

function loadYouTubeApi(): Promise<void> {
  if (window.YT) return Promise.resolve()
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve()
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return youtubeApiPromise
}

function getVideoId(url: string): string | undefined {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname === 'youtu.be') return parsedUrl.pathname.slice(1) || undefined
    if (parsedUrl.hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') return parsedUrl.searchParams.get('v') ?? undefined
      if (parsedUrl.pathname.startsWith('/embed/')) return parsedUrl.pathname.split('/')[2]
      if (parsedUrl.pathname.startsWith('/shorts/')) return parsedUrl.pathname.split('/')[2]
    }
  } catch {
    return undefined
  }
  return undefined
}

export function YouTubeTrackPlayer({ tracks, mediaLinks }: YouTubeTrackPlayerProps) {
  const playableTracks = useMemo(() => tracks.map((track) => ({ track, videoId: getVideoId(mediaLinks.find((link) => link.trackId === track.id)?.url ?? '') })).filter((entry): entry is { track: Track; videoId: string } => Boolean(entry.videoId)), [mediaLinks, tracks])
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>(playableTracks[0]?.track.id)
  const selectedTrack = playableTracks.find((entry) => entry.track.id === selectedTrackId)
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const selectedTrackIdRef = useRef(selectedTrackId)

  useEffect(() => {
    selectedTrackIdRef.current = selectedTrackId
  }, [selectedTrackId])

  useEffect(() => {
    if (playableTracks.length === 0) return
    let cancelled = false
    playerRef.current?.destroy()
    playerRef.current = null

    loadYouTubeApi().then(() => {
      if (cancelled || !playerContainerRef.current || !window.YT) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        host: 'https://www.youtube-nocookie.com',
        videoId: playableTracks[0].videoId,
        playerVars: { autoplay: 1, origin: window.location.origin, rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data !== window.YT?.PlayerState.ENDED) return
            const currentIndex = playableTracks.findIndex((entry) => entry.track.id === selectedTrackIdRef.current)
            const nextTrack = playableTracks[currentIndex + 1]
            if (nextTrack) setSelectedTrackId(nextTrack.track.id)
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [playableTracks])

  useEffect(() => {
    if (selectedTrack && playerRef.current) playerRef.current.loadVideoById(selectedTrack.videoId)
  }, [selectedTrack])

  if (playableTracks.length === 0) return <div className="player-empty">Add track-specific YouTube URLs while editing this album to play it here.</div>

  return (
    <section className="music-player" aria-label="Album player">
      <div className="player-frame" ref={playerContainerRef} data-testid="youtube-player-container" aria-label={selectedTrack ? `YouTube player for ${selectedTrack.track.title}` : 'YouTube player'} />
      <div className="player-now-playing"><span>Now playing</span><strong>{selectedTrack?.track.title}</strong></div>
      <div className="player-track-buttons">{playableTracks.map(({ track }) => <button className={track.id === selectedTrackId ? 'player-track active' : 'player-track'} key={track.id} onClick={() => setSelectedTrackId(track.id)} type="button"><span>{track.title}</span><RatingStars rating={track.rating} /><time>{track.duration}</time></button>)}</div>
    </section>
  )
}
