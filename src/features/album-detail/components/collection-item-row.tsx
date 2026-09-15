import type { CollectionItem, Owner } from '../../../domain/collection-item/collection-item.types'
import { formatCondition, formatCurrency, formatMediaType } from '../../../shared/lib/format'

type CollectionItemRowProps = {
  item: CollectionItem
  owner?: Owner
}

export function CollectionItemRow({ item, owner }: CollectionItemRowProps) {
  return (
    <article className="item-row">
      <div className={`format-icon large ${item.mediaType}`} aria-hidden="true">{item.mediaType === 'vinyl' ? 'LP' : 'CD'}</div>
      <div className="item-row-main">
        <div className="item-row-title"><strong>{formatMediaType(item.mediaType)} copy</strong><span className="condition-label">{formatCondition(item.condition)}</span></div>
        <p>{item.notes ?? 'No notes added for this copy.'}</p>
      </div>
      <div className="owner-chip"><span style={{ backgroundColor: owner?.accent }}>{owner?.initials ?? '?'}</span>{owner?.name ?? 'Unknown'}</div>
      {item.purchasePrice && <span className="item-price">{formatCurrency(item.purchasePrice.amount)}</span>}
    </article>
  )
}
