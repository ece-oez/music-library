import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { CollectionItem, Condition, MediaType } from '../../../domain/collection-item/collection-item.types'
import { repositories } from '../../../infrastructure/repositories'

const conditions: Condition[] = ['mint', 'near-mint', 'very-good', 'good', 'fair']

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`
}

export function CollectionItemEditorPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [mediaType, setMediaType] = useState<MediaType>('vinyl')
  const [ownerId, setOwnerId] = useState('owner-me')
  const [condition, setCondition] = useState<Condition>('very-good')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [notes, setNotes] = useState('')
  const albumQuery = useQuery({ queryKey: ['album', albumId], queryFn: () => repositories.albums.getAlbumById(albumId ?? ''), enabled: Boolean(albumId) })
  const ownersQuery = useQuery({ queryKey: ['owners'], queryFn: () => repositories.owners.getOwners() })

  const createItem = useMutation({
    mutationFn: (item: CollectionItem) => repositories.collectionItems.createCollectionItem(item),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['collection-items'] })
      navigate(`/albums/${albumId}`)
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const now = new Date().toISOString()
    const item: CollectionItem = {
      id: createId('item'),
      albumId: albumId ?? '',
      mediaType,
      ownerId,
      condition,
      purchasePrice: purchasePrice ? { amount: Number(purchasePrice), currency: 'EUR' } : undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    }
    createItem.mutate(item)
  }

  if (albumQuery.isLoading || ownersQuery.isLoading) return <div className="state-panel page-state">Preparing the shelf...</div>
  if (!albumQuery.data) return <div className="state-panel page-state error">This album could not be found. <Link to="/collection">Back to collection</Link></div>

  return (
    <div className="editor-page">
      <Link className="back-link" to={`/albums/${albumId}`}>&lt; Back to album</Link>
      <div className="editor-heading"><p className="section-kicker">Physical copy</p><h1>Add to the shelf</h1><p>{albumQuery.data.title} · {albumQuery.data.artists[0]?.name}</p></div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <fieldset><legend>Format</legend><div className="choice-row">{(['vinyl', 'cd'] as MediaType[]).map((option) => <label className={mediaType === option ? 'choice-card active' : 'choice-card'} key={option}><input checked={mediaType === option} onChange={() => setMediaType(option)} type="radio" value={option} /> <strong>{option === 'vinyl' ? 'Vinyl record' : 'CD'}</strong><span>{option === 'vinyl' ? '12 inch, 7 inch or other pressing' : 'Compact disc edition'}</span></label>)}</div></fieldset>
        <div className="form-row"><label>Owner<select value={ownerId} onChange={(event) => setOwnerId(event.target.value)}>{ownersQuery.data?.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></label><label>Condition<select value={condition} onChange={(event) => setCondition(event.target.value as Condition)}>{conditions.map((option) => <option key={option} value={option}>{option.replace('-', ' ')}</option>)}</select></label></div>
        <label>Purchase price <span className="label-note">EUR · optional</span><input min="0" step="0.01" type="number" value={purchasePrice} onChange={(event) => setPurchasePrice(event.target.value)} placeholder="25.00" /></label>
        <label>Notes <span className="label-note">optional</span><textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What makes this copy special?" /></label>
        {createItem.isError && <p className="form-error">The copy could not be saved.</p>}
        <div className="form-actions"><Link className="secondary-button" to={`/albums/${albumId}`}>Cancel</Link><button className="primary-button" disabled={createItem.isPending} type="submit">{createItem.isPending ? 'Saving...' : 'Save copy'}</button></div>
      </form>
    </div>
  )
}
