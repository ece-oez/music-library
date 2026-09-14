import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { YouTubeTrackPlayer } from '../../music-player/components/youtube-track-player'
import { calculateAlbumRating } from '../../../domain/album/album-rating'
import { AlbumArtwork } from '../../../shared/components/album-artwork'
import { RatingStars } from '../../../shared/components/rating-stars'
import { CollectionItemRow } from '../components/collection-item-row'
import { useAlbumDetail } from '../hooks/use-album-detail'
import { repositories } from '../../../infrastructure/repositories'

export function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const { album, items, owners, isLoading, isError } = useAlbumDetail(albumId)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const deleteAlbum = useMutation({
    mutationFn: async () => {
      if (!albumId) return
      await repositories.collectionItems.deleteCollectionItemsByAlbumId(albumId)
      await repositories.albums.deleteAlbum(albumId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['albums'] })
      await queryClient.invalidateQueries({ queryKey: ['collection-items'] })
      navigate('/collection')
    },
  })

  function handleDelete() {
    if (window.confirm(`Delete ${album?.title ?? 'this album'} and all physical copies?`)) deleteAlbum.mutate()
  }

  if (isLoading) return <div className="state-panel page-state">Loading album details...</div>
  if (isError || !album) return <div className="state-panel page-state error">This album could not be found. <Link to="/collection">Back to collection</Link></div>

  return (
    <div className="album-detail-page">
      <Link className="back-link" to="/collection">&lt; Back to collection</Link>
      <section className="album-hero">
        <AlbumArtwork artwork={album.artwork} size="large" className="album-detail-art" />
        <div className="album-hero-copy">
          <p className="section-kicker">{album.genres[0]?.name} · {album.releaseYear}</p>
          <h1>{album.title}</h1>
          <p className="album-artist">{album.artists.map((artist) => artist.name).join(', ')}</p>
          <div className="album-rating"><RatingStars rating={calculateAlbumRating(album)} /><span>{calculateAlbumRating(album) ? `${calculateAlbumRating(album)} average from rated tracks` : 'Rate tracks to score this album'}</span></div>
          <div className="album-tags">{album.tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}</div>
          <div className="detail-actions"><Link className="secondary-button" to={`/albums/${album.id}/edit`}>Edit album</Link><button className="danger-button" disabled={deleteAlbum.isPending} onClick={handleDelete} type="button">{deleteAlbum.isPending ? 'Deleting...' : 'Delete album'}</button></div>
        </div>
      </section>
      <div className="detail-columns">
        <section className="tracklist-section">
          <div className="section-heading"><div><p className="section-kicker">The music</p><h2>Track list</h2></div><span>{album.tracks.length} tracks</span></div>
          <YouTubeTrackPlayer tracks={album.tracks} mediaLinks={album.mediaLinks} />
        </section>
        <section className="copies-section">
          <div className="section-heading"><div><p className="section-kicker">On our shelf</p><h2>Our copies</h2></div><div className="section-heading-actions"><span>{items.length} total</span><Link className="text-action" to={`/albums/${album.id}/items/new`}>Add copy +</Link></div></div>
          <div className="item-list">{items.map((item) => <CollectionItemRow item={item} owner={owners.find((owner) => owner.id === item.ownerId)} key={item.id} />)}</div>
        </section>
      </div>
    </div>
  )
}
