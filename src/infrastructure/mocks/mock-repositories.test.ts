import { describe, expect, it } from 'vitest'
import { MockAlbumRepository } from './mock-album-repository'
import { MockCollectionItemRepository } from './mock-collection-item-repository'

describe('mock repositories', () => {
  it('keeps album metadata separate from physical collection copies', async () => {
    const albums = await new MockAlbumRepository().getAlbums()
    const items = await new MockCollectionItemRepository().getCollectionItems()

    expect(albums).toHaveLength(4)
    expect(items).toHaveLength(5)
    expect(items.filter((item) => item.albumId === 'album-dark-side')).toHaveLength(2)
    expect(albums[0]).not.toHaveProperty('mediaType')
    expect(items[0]).not.toHaveProperty('title')
  })

  it('returns an album by its stable domain id', async () => {
    const album = await new MockAlbumRepository().getAlbumById('album-kind-of-blue')

    expect(album?.title).toBe('Kind of Blue')
    expect(album?.artists[0]?.name).toBe('Miles Davis')
  })
})
