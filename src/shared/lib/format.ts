import type { Condition, MediaType } from '../../domain/collection-item/collection-item.types'

export function formatMediaType(mediaType: MediaType): string {
  return mediaType === 'vinyl' ? 'Vinyl' : 'CD'
}

export function formatCondition(condition: Condition): string {
  return condition
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount)
}
