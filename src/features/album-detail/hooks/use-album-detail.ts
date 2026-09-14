import { useQuery } from '@tanstack/react-query'
import { repositories } from '../../../infrastructure/repositories'

export function useAlbumDetail(albumId: string | undefined) {
  const albumQuery = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => repositories.albums.getAlbumById(albumId ?? ''),
    enabled: Boolean(albumId),
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
    album: albumQuery.data,
    items: itemsQuery.data?.filter((item) => item.albumId === albumId) ?? [],
    owners: ownersQuery.data ?? [],
    isLoading: albumQuery.isLoading || itemsQuery.isLoading || ownersQuery.isLoading,
    isError: albumQuery.isError || itemsQuery.isError || ownersQuery.isError,
  }
}
