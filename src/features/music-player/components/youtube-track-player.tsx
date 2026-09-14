import { useEffect, useMemo, useRef, useState } from 'react'
import type { MediaLink, Track } from '../../../domain/album/album.types'
import { RatingStars } from '../../../shared/components/rating-stars'

type YouTubeTrackPlayerProps = {
  tracks: Track[]
  mediaLinks: MediaLink[]
}

type YouTubePlayerEvent = { data: number }
type YouTubePlayer = { destroy: () => void }
type YouTubePlayerConstructor = new (element: HTMLIFrameElement, options: { events: { onStateChange: (event: YouTubePlayerEvent) => void } }) => YouTubePlayer

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
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)

  useEffect(() => {
    if (!selectedTrack) return
    let cancelled = false
    playerRef.current?.destroy()
    playerRef.current = null

    loadYouTubeApi().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => {
            if (event.data !== window.YT?.PlayerState.ENDED) return
            const currentIndex = playableTracks.findIndex((entry) => entry.track.id === selectedTrack.track.id)
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
  }, [playableTracks, selectedTrack])

  if (playableTracks.length === 0) return <div className="player-empty">Add track-specific YouTube URLs while editing this album to play it here.</div>

  const appOrigin = window.location.origin
  const playerUrl = selectedTrack
    ? `https://www.youtube-nocookie.com/embed/${selectedTrack.videoId}?autoplay=1&rel=0&origin=${encodeURIComponent(appOrigin)}&widget_referrer=${encodeURIComponent(appOrigin)}`
    : undefined

  return (
    <section className="music-player" aria-label="Album player">
      <div className="player-frame">
        {selectedTrack && playerUrl && <iframe key={selectedTrack.videoId} ref={iframeRef} title={`YouTube player for ${selectedTrack.track.title}`} src={`${playerUrl}&enablejsapi=1`} referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
      </div>
      <div className="player-now-playing"><span>Now playing</span><strong>{selectedTrack?.track.title}</strong></div>
      <div className="player-track-buttons">{playableTracks.map(({ track }) => <button className={track.id === selectedTrackId ? 'player-track active' : 'player-track'} key={track.id} onClick={() => setSelectedTrackId(track.id)} type="button"><span>{track.title}</span><RatingStars rating={track.rating} /><time>{track.duration}</time></button>)}</div>
    </section>
  )
}
