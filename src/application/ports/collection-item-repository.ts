import type {
  CollectionItem,
  CollectionItemId,
} from '../../domain/collection-item/collection-item.types'

export interface CollectionItemRepository {
  getCollectionItems(): Promise<CollectionItem[]>
  getCollectionItemById(id: CollectionItemId): Promise<CollectionItem | undefined>
  createCollectionItem(item: CollectionItem): Promise<CollectionItem>
  updateCollectionItem(item: CollectionItem): Promise<CollectionItem>
}
