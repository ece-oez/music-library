import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AlbumEditorPage } from './album-editor-page'

function renderEditor() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <MemoryRouter initialEntries={['/albums/new']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/albums/new" element={<AlbumEditorPage />} />
          <Route path="/albums/:albumId" element={<p>Album detail</p>} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('AlbumEditorPage', () => {
  it('creates an album and navigates to its detail page', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.type(screen.getByLabelText('Album title'), 'Hejira')
    await user.type(screen.getByLabelText('Artist'), 'Joni Mitchell')
    await user.type(screen.getByLabelText('Release year'), '1976')
    await user.type(screen.getByLabelText('Genre'), 'Singer-songwriter')
    await user.click(screen.getByRole('button', { name: 'Save album' }))

    await waitFor(() => expect(screen.getByText('Album detail')).toBeInTheDocument())
  })
})
