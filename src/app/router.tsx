import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/app-layout'
import { AlbumDetailPage } from '../features/album-detail/pages/album-detail-page'
import { AlbumEditorPage } from '../features/album-editor/pages/album-editor-page'
import { CollectionPage } from '../features/collection/pages/collection-page'
import { CollectionItemEditorPage } from '../features/collection-item-editor/pages/collection-item-editor-page'
import { LoginPage } from '../features/auth/pages/login-page'
import { RequireAuth } from './auth/require-auth'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/collection" replace />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/albums/new" element={<AlbumEditorPage />} />
        <Route path="/albums/:albumId/edit" element={<AlbumEditorPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="/albums/:albumId/items/new" element={<CollectionItemEditorPage />} />
        <Route path="*" element={<Navigate to="/collection" replace />} />
      </Route>
      </Route>
    </Routes>
  )
}
