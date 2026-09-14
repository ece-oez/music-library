import type { CollectionItemRepository } from '../../application/ports/collection-item-repository'
import type {
  CollectionItem,
  CollectionItemId,
} from '../../domain/collection-item/collection-item.types'
import { mockCollectionItems } from './mock-data'

const delay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
}

export class MockCollectionItemRepository implements CollectionItemRepository {
  async getCollectionItems(): Promise<CollectionItem[]> {
    await delay()
    return mockCollectionItems
  }

  async getCollectionItemById(id: CollectionItemId): Promise<CollectionItem | undefined> {
    await delay()
    return mockCollectionItems.find((item) => item.id === id)
  }
}
