import { Link, useParams } from 'react-router-dom'
import { AlbumArtwork } from '../../../shared/components/album-artwork'
import { RatingStars } from '../../../shared/components/rating-stars'
import { CollectionItemRow } from '../components/collection-item-row'
import { useAlbumDetail } from '../hooks/use-album-detail'

export function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const { album, items, owners, isLoading, isError } = useAlbumDetail(albumId)

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
          <div className="album-rating"><RatingStars rating={album.rating} /><span>{album.rating ? `${album.rating}.0 rating` : 'Not rated yet'}</span></div>
          <div className="album-tags">{album.tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}</div>
          {album.mediaLinks[0] && <a className="youtube-link" href={album.mediaLinks[0].url} target="_blank" rel="noreferrer"><span className="play-mark">▶</span> {album.mediaLinks[0].label}</a>}
        </div>
      </section>
      <div className="detail-columns">
        <section className="tracklist-section">
          <div className="section-heading"><div><p className="section-kicker">The music</p><h2>Track list</h2></div><span>{album.tracks.length} tracks</span></div>
          <ol className="tracklist">{album.tracks.map((track, index) => <li key={track.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{track.title}</strong><time>{track.duration}</time></li>)}</ol>
        </section>
        <section className="copies-section">
          <div className="section-heading"><div><p className="section-kicker">On our shelf</p><h2>Our copies</h2></div><div className="section-heading-actions"><span>{items.length} total</span><Link className="text-action" to={`/albums/${album.id}/items/new`}>Add copy +</Link></div></div>
          <div className="item-list">{items.map((item) => <CollectionItemRow item={item} owner={owners.find((owner) => owner.id === item.ownerId)} key={item.id} />)}</div>
        </section>
      </div>
    </div>
  )
}
