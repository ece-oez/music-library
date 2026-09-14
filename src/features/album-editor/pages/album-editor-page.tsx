import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { calculateAlbumRating } from '../../../domain/album/album-rating'
import type { Album, Track } from '../../../domain/album/album.types'
import { repositories } from '../../../infrastructure/repositories'

type TrackDraft = Track & { youtubeUrl: string }
type AlbumEditorFormProps = { albumId?: string; initialAlbum?: Album }

const fallbackArtwork = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85'

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function toTrackDrafts(album: Album): TrackDraft[] {
  return album.tracks.map((track) => ({ ...track, youtubeUrl: album.mediaLinks.find((link) => link.trackId === track.id)?.url ?? '' }))
}

function AlbumEditorForm({ albumId, initialAlbum }: AlbumEditorFormProps) {
  const isEditing = Boolean(albumId)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(initialAlbum?.title ?? '')
  const [artist, setArtist] = useState(initialAlbum?.artists[0]?.name ?? '')
  const [releaseYear, setReleaseYear] = useState(initialAlbum ? String(initialAlbum.releaseYear) : '')
  const [genre, setGenre] = useState(initialAlbum?.genres[0]?.name ?? '')
  const [artworkUrl, setArtworkUrl] = useState(initialAlbum?.artwork.url ?? '')
  const [tracks, setTracks] = useState<TrackDraft[]>(initialAlbum ? toTrackDrafts(initialAlbum) : [])

  const saveAlbum = useMutation({
    mutationFn: (album: Album) => isEditing ? repositories.albums.updateAlbum(album) : repositories.albums.createAlbum(album),
    onSuccess: async (album) => {
      await queryClient.invalidateQueries({ queryKey: ['albums'] })
      await queryClient.invalidateQueries({ queryKey: ['album', album.id] })
      navigate(`/albums/${album.id}`)
    },
  })

  function updateTrack(trackId: string, field: keyof TrackDraft, value: string) {
    setTracks((currentTracks) => currentTracks.map((track) => track.id === trackId ? { ...track, [field]: value } : track))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = new Date().toISOString()
    const tracksToSave = tracks.filter((track) => track.title.trim())
    const album: Album = {
      id: initialAlbum?.id ?? createId('album'),
      title: title.trim(),
      artists: [{ id: initialAlbum?.artists[0]?.id ?? createId('artist'), name: artist.trim() }],
      releaseYear: Number(releaseYear),
      genres: [{ id: initialAlbum?.genres[0]?.id ?? createId('genre'), name: genre.trim() }],
      tags: initialAlbum?.tags ?? [],
      artwork: { url: artworkUrl.trim() || fallbackArtwork, alt: `${title.trim()} artwork`, source: 'mock' },
      tracks: tracksToSave.map((track) => ({ id: track.id, title: track.title.trim(), duration: track.duration, rating: track.rating })),
      mediaLinks: tracksToSave.filter((track) => track.youtubeUrl.trim()).map((track) => ({ id: `link-${track.id}`, url: track.youtubeUrl.trim(), label: `Play ${track.title.trim()}`, trackId: track.id })),
      rating: undefined,
      isFavorite: initialAlbum?.isFavorite ?? false,
      createdAt: initialAlbum?.createdAt ?? now,
      updatedAt: now,
    }
    album.rating = calculateAlbumRating(album)
    saveAlbum.mutate(album)
  }

  return (
    <div className="editor-page album-editor-page">
      <Link className="back-link" to={isEditing ? `/albums/${albumId}` : '/collection'}>&lt; {isEditing ? 'Back to album' : 'Back to collection'}</Link>
      <div className="editor-heading"><p className="section-kicker">{isEditing ? 'Refine the record' : 'Add to the shelf'}</p><h1>{isEditing ? 'Edit album' : 'New album'}</h1><p>{isEditing ? 'Keep the music metadata and track links up to date.' : 'Start with the music and add its tracks.'}</p></div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>Album title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Blue Train" /></label>
        <label>Artist<input required value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="e.g. John Coltrane" /></label>
        <div className="form-row"><label>Release year<input required min="1900" max="2100" type="number" value={releaseYear} onChange={(event) => setReleaseYear(event.target.value)} placeholder="1957" /></label><label>Genre<input required value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="Jazz" /></label></div>
        <label>Artwork URL <span className="label-note">optional</span><input type="url" value={artworkUrl} onChange={(event) => setArtworkUrl(event.target.value)} placeholder="https://..." /></label>
        <fieldset className="track-editor"><legend>Tracks and YouTube links</legend><p className="field-help">Add a YouTube URL to make that track playable inside the album page.</p>
          {tracks.map((track, index) => <div className="track-draft" key={track.id}><span className="track-number">{String(index + 1).padStart(2, '0')}</span><div className="track-draft-fields"><input aria-label={`Track ${index + 1} title`} required value={track.title} onChange={(event) => updateTrack(track.id, 'title', event.target.value)} placeholder="Track title" /><div className="form-row"><input aria-label={`Track ${index + 1} duration`} value={track.duration} onChange={(event) => updateTrack(track.id, 'duration', event.target.value)} placeholder="Duration, e.g. 4:32" /><select aria-label={`Track ${index + 1} rating`} value={track.rating ?? ''} onChange={(event) => setTracks((currentTracks) => currentTracks.map((currentTrack) => currentTrack.id === track.id ? { ...currentTrack, rating: event.target.value ? Number(event.target.value) as Track['rating'] : undefined } : currentTrack))}><option value="">Not rated</option><option value="1">1 star</option><option value="2">2 stars</option><option value="3">3 stars</option><option value="4">4 stars</option><option value="5">5 stars</option></select></div><input aria-label={`Track ${index + 1} YouTube URL`} type="url" value={track.youtubeUrl} onChange={(event) => updateTrack(track.id, 'youtubeUrl', event.target.value)} placeholder="YouTube URL (optional)" /></div><button className="remove-track" type="button" onClick={() => setTracks((currentTracks) => currentTracks.filter((currentTrack) => currentTrack.id !== track.id))} aria-label={`Remove track ${index + 1}`}>×</button></div>)}
          <button className="add-track-button" type="button" onClick={() => setTracks((currentTracks) => [...currentTracks, { id: createId('track'), title: '', duration: '', youtubeUrl: '' }])}>+ Add track</button>
        </fieldset>
        {saveAlbum.isError && <p className="form-error">The album could not be saved.</p>}
        <div className="form-actions"><Link className="secondary-button" to={isEditing ? `/albums/${albumId}` : '/collection'}>Cancel</Link><button className="primary-button" disabled={saveAlbum.isPending} type="submit">{saveAlbum.isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Save album'}</button></div>
      </form>
    </div>
  )
}

export function AlbumEditorPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const albumQuery = useQuery({ queryKey: ['album', albumId], queryFn: () => repositories.albums.getAlbumById(albumId ?? ''), enabled: Boolean(albumId) })

  if (albumId && albumQuery.isLoading) return <div className="state-panel page-state">Preparing the album editor...</div>
  if (albumId && !albumQuery.data) return <div className="state-panel page-state error">This album could not be found. <Link to="/collection">Back to collection</Link></div>
  return <AlbumEditorForm key={albumId ?? 'new'} albumId={albumId} initialAlbum={albumQuery.data} />
}
