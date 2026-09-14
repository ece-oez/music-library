import { useMemo, useState } from 'react'
import type { MediaLink, Track } from '../../../domain/album/album.types'
import { RatingStars } from '../../../shared/components/rating-stars'

type YouTubeTrackPlayerProps = {
  tracks: Track[]
  mediaLinks: MediaLink[]
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

  if (playableTracks.length === 0) return <div className="player-empty">Add track-specific YouTube URLs while editing this album to play it here.</div>

  const appOrigin = window.location.origin
  const playerUrl = selectedTrack
    ? `https://www.youtube-nocookie.com/embed/${selectedTrack.videoId}?autoplay=1&rel=0&origin=${encodeURIComponent(appOrigin)}&widget_referrer=${encodeURIComponent(appOrigin)}`
    : undefined

  return (
    <section className="music-player" aria-label="Album player">
      <div className="player-frame">
        {selectedTrack && playerUrl && <iframe key={selectedTrack.videoId} title={`YouTube player for ${selectedTrack.track.title}`} src={playerUrl} referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
      </div>
      <div className="player-now-playing"><span>Now playing</span><strong>{selectedTrack?.track.title}</strong></div>
      <div className="player-track-buttons">{playableTracks.map(({ track }) => <button className={track.id === selectedTrackId ? 'player-track active' : 'player-track'} key={track.id} onClick={() => setSelectedTrackId(track.id)} type="button"><span>{track.title}</span><RatingStars rating={track.rating} /><time>{track.duration}</time></button>)}</div>
    </section>
  )
}
