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

  it('persists collection item mutations inside the repository instance', async () => {
    const repository = new MockCollectionItemRepository()
    const item = {
      id: 'item-test',
      albumId: 'album-kind-of-blue',
      mediaType: 'vinyl' as const,
      ownerId: 'owner-me',
      condition: 'mint' as const,
      createdAt: '2025-06-10T10:00:00.000Z',
      updatedAt: '2025-06-10T10:00:00.000Z',
    }

    await repository.createCollectionItem(item)
    expect(await repository.getCollectionItemById(item.id)).toEqual(item)

    const updatedItem = { ...item, condition: 'very-good' as const }
    await repository.updateCollectionItem(updatedItem)
    expect(await repository.getCollectionItemById(item.id)).toEqual(updatedItem)
  })
})
