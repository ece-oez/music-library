import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/app-layout'
import { AlbumDetailPage } from '../features/album-detail/pages/album-detail-page'
import { CollectionPage } from '../features/collection/pages/collection-page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/collection" replace />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="*" element={<Navigate to="/collection" replace />} />
      </Route>
    </Routes>
  )
}
