import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CollectionPage } from './collection-page'

function renderCollection() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <CollectionPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('CollectionPage', () => {
  it('renders the mock collection after loading', async () => {
    renderCollection()

    expect(screen.getByText('Loading the shelf...')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('The Dark Side of the Moon')).toBeInTheDocument())

    expect(screen.getByText('Kind of Blue')).toBeInTheDocument()
    expect(screen.getByText('Hounds of Love')).toBeInTheDocument()
  })
})
