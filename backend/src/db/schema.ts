import { sql } from 'drizzle-orm'
import { check, date, index, integer, numeric, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

export const mediaTypeEnum = pgEnum('media_type', ['vinyl', 'cd'])
export const conditionEnum = pgEnum('condition', ['mint', 'near-mint', 'very-good', 'good', 'fair'])
export const mediaProviderEnum = pgEnum('media_provider', ['youtube'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 80 }).notNull(),
  displayName: varchar('display_name', { length: 120 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  initials: varchar('initials', { length: 4 }).notNull(),
  accent: varchar('accent', { length: 32 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('users_username_unique').on(table.username)])

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
}, (table) => [uniqueIndex('sessions_token_hash_unique').on(table.tokenHash), index('sessions_user_id_index').on(table.userId)])

export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 180 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 180 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('artists_normalized_name_unique').on(table.normalizedName)])

export const albums = pgTable('albums', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 240 }).notNull(),
  releaseYear: integer('release_year'),
  artworkUrl: text('artwork_url'),
  artworkAlt: text('artwork_alt'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('albums_title_index').on(table.title)])

export const albumArtists = pgTable('album_artists', {
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  artistId: uuid('artist_id').references(() => artists.id, { onDelete: 'restrict' }).notNull(),
  artistOrder: integer('artist_order').notNull().default(0),
}, (table) => [primaryKey({ columns: [table.albumId, table.artistId] })])

export const genres = pgTable('genres', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 120 }).notNull(),
}, (table) => [uniqueIndex('genres_normalized_name_unique').on(table.normalizedName)])

export const albumGenres = pgTable('album_genres', {
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  genreId: uuid('genre_id').references(() => genres.id, { onDelete: 'restrict' }).notNull(),
}, (table) => [primaryKey({ columns: [table.albumId, table.genreId] })])

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 120 }).notNull(),
}, (table) => [uniqueIndex('tags_normalized_name_unique').on(table.normalizedName)])

export const albumTags = pgTable('album_tags', {
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'restrict' }).notNull(),
}, (table) => [primaryKey({ columns: [table.albumId, table.tagId] })])

export const tracks = pgTable('tracks', {
  id: uuid('id').defaultRandom().primaryKey(),
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 240 }).notNull(),
  durationSeconds: integer('duration_seconds'),
  trackOrder: integer('track_order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('tracks_album_order_unique').on(table.albumId, table.trackOrder), check('tracks_duration_non_negative', sql`${table.durationSeconds} is null or ${table.durationSeconds} >= 0`)])

export const trackMediaLinks = pgTable('track_media_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  trackId: uuid('track_id').references(() => tracks.id, { onDelete: 'cascade' }).notNull(),
  provider: mediaProviderEnum('provider').notNull(),
  url: text('url').notNull(),
  providerResourceId: varchar('provider_resource_id', { length: 160 }),
  label: varchar('label', { length: 240 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('track_media_provider_resource_unique').on(table.trackId, table.provider, table.providerResourceId)])

export const trackRatings = pgTable('track_ratings', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  trackId: uuid('track_id').references(() => tracks.id, { onDelete: 'cascade' }).notNull(),
  value: integer('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.trackId] }), check('track_ratings_value_range', sql`${table.value} between 1 and 5`)])

export const albumFavorites = pgTable('album_favorites', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.albumId] })])

export const collectionItems = pgTable('collection_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  albumId: uuid('album_id').references(() => albums.id, { onDelete: 'cascade' }).notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'restrict' }).notNull(),
  mediaType: mediaTypeEnum('media_type').notNull(),
  condition: conditionEnum('condition').notNull(),
  purchaseAmount: numeric('purchase_amount', { precision: 12, scale: 2 }),
  purchaseCurrency: varchar('purchase_currency', { length: 3 }).default('EUR').notNull(),
  physicalPhotoUrl: text('physical_photo_url'),
  physicalPhotoAlt: text('physical_photo_alt'),
  notes: text('notes'),
  acquiredAt: date('acquired_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [check('collection_items_purchase_non_negative', sql`${table.purchaseAmount} is null or ${table.purchaseAmount} >= 0`), index('collection_items_album_index').on(table.albumId), index('collection_items_owner_index').on(table.ownerId)])