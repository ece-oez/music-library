import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { YouTubeTrackPlayer } from './youtube-track-player'

describe('YouTubeTrackPlayer', () => {
  it('plays track-specific videos inside the application', async () => {
    const user = userEvent.setup()
    render(
      <YouTubeTrackPlayer
        tracks={[
          { id: 'track-one', title: 'First song', duration: '3:10' },
          { id: 'track-two', title: 'Second song', duration: '4:20' },
        ]}
        mediaLinks={[
          { id: 'link-one', trackId: 'track-one', url: 'https://www.youtube.com/watch?v=firstVideo', label: 'Play First song' },
          { id: 'link-two', trackId: 'track-two', url: 'https://youtu.be/secondVideo', label: 'Play Second song' },
        ]}
      />,
    )

    const firstPlayer = screen.getByTitle('YouTube player for First song')
    expect(firstPlayer).toHaveAttribute('src', expect.stringContaining('/embed/firstVideo'))
    expect(firstPlayer).toHaveAttribute('src', expect.stringContaining(`origin=${encodeURIComponent(window.location.origin)}`))
    expect(firstPlayer).toHaveAttribute('src', expect.stringContaining(`widget_referrer=${encodeURIComponent(window.location.origin)}`))
    expect(firstPlayer).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
    await user.click(screen.getByRole('button', { name: /Second song/ }))
    expect(screen.getByTitle('YouTube player for Second song')).toHaveAttribute('src', expect.stringContaining('/embed/secondVideo'))
  })

  it('explains when an album has no playable track links', () => {
    render(<YouTubeTrackPlayer tracks={[{ id: 'track-one', title: 'First song', duration: '3:10' }]} mediaLinks={[]} />)

    expect(screen.getByText(/Add track-specific YouTube URLs/)).toBeInTheDocument()
  })
})
