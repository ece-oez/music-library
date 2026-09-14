import type { CollectionItemRepository } from '../../application/ports/collection-item-repository'
import type {
  CollectionItem,
  CollectionItemId,
} from '../../domain/collection-item/collection-item.types'
import type { AlbumId } from '../../domain/album/album.types'
import { mockCollectionItems } from './mock-data'

const delay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
}

export class MockCollectionItemRepository implements CollectionItemRepository {
  private items = [...mockCollectionItems]

  async getCollectionItems(): Promise<CollectionItem[]> {
    await delay()
    return [...this.items]
  }

  async getCollectionItemById(id: CollectionItemId): Promise<CollectionItem | undefined> {
    await delay()
    return this.items.find((item) => item.id === id)
  }

  async createCollectionItem(item: CollectionItem): Promise<CollectionItem> {
    await delay()
    this.items.push(item)
    return item
  }

  async updateCollectionItem(item: CollectionItem): Promise<CollectionItem> {
    await delay()
    this.items = this.items.map((currentItem) => currentItem.id === item.id ? item : currentItem)
    return item
  }

  async deleteCollectionItemsByAlbumId(albumId: AlbumId): Promise<void> {
    await delay()
    this.items = this.items.filter((item) => item.albumId !== albumId)
  }
}
