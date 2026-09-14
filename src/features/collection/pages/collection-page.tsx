import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CollectionCard } from '../components/collection-card'
import { useCollectionData } from '../hooks/use-collection-data'

type Filter = 'all' | 'vinyl' | 'cd' | 'favorites'

export function CollectionPage() {
  const { albums, items, owners, isLoading, isError } = useCollectionData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visibleAlbums = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return albums.filter((album) => {
      const albumItems = items.filter((item) => item.albumId === album.id)
      const matchesSearch = normalizedSearch.length === 0 || [album.title, ...album.artists.map((artist) => artist.name), ...album.genres.map((genre) => genre.name)].join(' ').toLowerCase().includes(normalizedSearch)
      const matchesFilter = filter === 'all' || (filter === 'favorites' && album.isFavorite) || albumItems.some((item) => item.mediaType === filter)
      return matchesSearch && matchesFilter
    })
  }, [albums, filter, items, search])

  return (
    <div className="collection-page">
      <section className="collection-intro">
        <div>
          <p className="section-kicker">The shared shelf · 2025</p>
          <h1>Records worth<br /><em>coming back to.</em></h1>
          <p className="intro-copy">A growing archive of the music that makes the room feel right.</p>
          <Link className="primary-button intro-action" to="/albums/new">Add an album <span aria-hidden="true">+</span></Link>
        </div>
        <div className="collection-stat"><strong>{albums.length}</strong><span>albums<br />in the room</span></div>
      </section>
      <section className="collection-toolbar" aria-label="Collection controls">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">/</span>
          <span className="sr-only">Search collection</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search artist, album or genre" type="search" />
        </label>
        <div className="filter-tabs" role="group" aria-label="Filter collection">
          {(['all', 'vinyl', 'cd', 'favorites'] as Filter[]).map((option) => (
            <button className={filter === option ? 'filter-tab active' : 'filter-tab'} key={option} onClick={() => setFilter(option)} type="button">
              {option === 'favorites' ? 'Favorites' : option === 'all' ? 'All records' : option.toUpperCase()}
            </button>
          ))}
        </div>
      </section>
      {isLoading && <div className="state-panel">Loading the shelf...</div>}
      {isError && <div className="state-panel error">The collection could not be opened.</div>}
      {!isLoading && !isError && visibleAlbums.length === 0 && <div className="state-panel">Nothing here yet. Try another search.</div>}
      {!isLoading && !isError && visibleAlbums.length > 0 && (
        <section className="collection-grid" aria-label="Albums in the collection">
          {visibleAlbums.map((album) => <CollectionCard album={album} items={items.filter((item) => item.albumId === album.id)} owners={owners} key={album.id} />)}
        </section>
      )}
    </div>
  )
}
