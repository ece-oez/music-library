type RatingStarsProps = {
  rating?: number
}

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <span className="rating-stars" aria-label={rating ? `${rating} out of 5 stars` : 'Not rated'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span className={rating && star <= rating ? 'star filled' : 'star'} key={star}>*</span>
      ))}
    </span>
  )
}
