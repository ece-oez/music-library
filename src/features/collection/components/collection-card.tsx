import { Link } from 'react-router-dom'
import type { Album } from '../../../domain/album/album.types'
import type { CollectionItem, Owner } from '../../../domain/collection-item/collection-item.types'
import { AlbumArtwork } from '../../../shared/components/album-artwork'
import { RatingStars } from '../../../shared/components/rating-stars'
import { formatMediaType } from '../../../shared/lib/format'

type CollectionCardProps = {
  album: Album
  items: CollectionItem[]
  owners: Owner[]
}

export function CollectionCard({ album, items, owners }: CollectionCardProps) {
  return (
    <article className="collection-card">
      <Link className="collection-card-art" to={`/albums/${album.id}`}>
        <AlbumArtwork artwork={album.artwork} size="large" />
        {album.isFavorite && <span className="favorite-badge" aria-label="Favorite album">favorite</span>}
      </Link>
      <div className="collection-card-body">
        <div className="collection-card-heading">
          <div>
            <p className="eyebrow">{album.releaseYear} · {album.genres[0]?.name}</p>
            <h2><Link to={`/albums/${album.id}`}>{album.title}</Link></h2>
            <p className="artist-name">{album.artists.map((artist) => artist.name).join(', ')}</p>
          </div>
          <RatingStars rating={album.rating} />
        </div>
        <div className="collection-card-meta">
          <div className="format-stack">
            {items.map((item) => {
              const owner = owners.find((candidate) => candidate.id === item.ownerId)
              return (
                <span className="format-pill" key={item.id} title={`${formatMediaType(item.mediaType)} owned by ${owner?.name ?? 'Unknown'}`}>
                  <span className={`format-icon ${item.mediaType}`} aria-hidden="true">{item.mediaType === 'vinyl' ? 'LP' : 'CD'}</span>
                  {formatMediaType(item.mediaType)}
                </span>
              )
            })}
          </div>
          <span className="copy-count">{items.length} {items.length === 1 ? 'copy' : 'copies'}</span>
        </div>
      </div>
    </article>
  )
}
