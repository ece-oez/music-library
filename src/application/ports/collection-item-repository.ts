import type {
  CollectionItem,
  CollectionItemId,
} from '../../domain/collection-item/collection-item.types'

export interface CollectionItemRepository {
  getCollectionItems(): Promise<CollectionItem[]>
  getCollectionItemById(id: CollectionItemId): Promise<CollectionItem | undefined>
}
