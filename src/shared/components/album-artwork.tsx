import type { Artwork } from '../../domain/album/album.types'

type AlbumArtworkProps = {
  artwork: Artwork
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function AlbumArtwork({ artwork, size = 'medium', className = '' }: AlbumArtworkProps) {
  return (
    <div className={`album-art album-art-${size} ${className}`}>
      <img src={artwork.url} alt={artwork.alt} loading="lazy" />
      <span className="album-art-shine" aria-hidden="true" />
    </div>
  )
}
