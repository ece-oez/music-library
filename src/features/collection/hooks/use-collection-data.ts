import { useQuery } from '@tanstack/react-query'
import { repositories } from '../../../infrastructure/repositories'

export function useCollectionData() {
  const albumsQuery = useQuery({
    queryKey: ['albums'],
    queryFn: () => repositories.albums.getAlbums(),
  })
  const itemsQuery = useQuery({
    queryKey: ['collection-items'],
    queryFn: () => repositories.collectionItems.getCollectionItems(),
  })
  const ownersQuery = useQuery({
    queryKey: ['owners'],
    queryFn: () => repositories.owners.getOwners(),
  })

  return {
    albums: albumsQuery.data ?? [],
    items: itemsQuery.data ?? [],
    owners: ownersQuery.data ?? [],
    isLoading: albumsQuery.isLoading || itemsQuery.isLoading || ownersQuery.isLoading,
    isError: albumsQuery.isError || itemsQuery.isError || ownersQuery.isError,
  }
}
