import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Album } from '../../../domain/album/album.types'
import { repositories } from '../../../infrastructure/repositories'

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`
}

export function AlbumEditorPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [genre, setGenre] = useState('')
  const [artworkUrl, setArtworkUrl] = useState('')

  const createAlbum = useMutation({
    mutationFn: (album: Album) => repositories.albums.createAlbum(album),
    onSuccess: async (album) => {
      await queryClient.invalidateQueries({ queryKey: ['albums'] })
      navigate(`/albums/${album.id}`)
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = new Date().toISOString()
    const album: Album = {
      id: createId('album'),
      title: title.trim(),
      artists: [{ id: createId('artist'), name: artist.trim() }],
      releaseYear: Number(releaseYear),
      genres: [{ id: createId('genre'), name: genre.trim() }],
      tags: [],
      artwork: {
        url: artworkUrl.trim() || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85',
        alt: `${title.trim()} artwork`,
        source: 'mock',
      },
      tracks: [],
      mediaLinks: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    }
    createAlbum.mutate(album)
  }

  return (
    <div className="editor-page">
      <Link className="back-link" to="/collection">&lt; Back to collection</Link>
      <div className="editor-heading"><p className="section-kicker">Add to the shelf</p><h1>New album</h1><p>Start with the music. You can add a physical copy next.</p></div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>Album title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Blue Train" /></label>
        <label>Artist<input required value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="e.g. John Coltrane" /></label>
        <div className="form-row"><label>Release year<input required min="1900" max="2100" type="number" value={releaseYear} onChange={(event) => setReleaseYear(event.target.value)} placeholder="1957" /></label><label>Genre<input required value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="Jazz" /></label></div>
        <label>Artwork URL <span className="label-note">optional</span><input type="url" value={artworkUrl} onChange={(event) => setArtworkUrl(event.target.value)} placeholder="https://..." /></label>
        {createAlbum.isError && <p className="form-error">The album could not be saved.</p>}
        <div className="form-actions"><Link className="secondary-button" to="/collection">Cancel</Link><button className="primary-button" disabled={createAlbum.isPending} type="submit">{createAlbum.isPending ? 'Saving...' : 'Save album'}</button></div>
      </form>
    </div>
  )
}
