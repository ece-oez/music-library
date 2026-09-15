import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/auth/auth-context'

export function LoginPage() {
  const { user, signIn, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()

  if (user) return <Navigate to="/collection" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    try {
      await signIn(username.trim(), password)
      const from = (location.state as { from?: string } | null)?.from ?? '/collection'
      navigate(from, { replace: true })
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Sign in failed.')
    }
  }

  return (
    <main className="login-page">
      <div className="login-art" aria-hidden="true"><span>TP</span></div>
      <section className="login-panel">
        <p className="section-kicker">Tracks n Plates</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to rate tracks and keep your listening notes personal.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label>Password<input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={isLoading} type="submit">{isLoading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="login-demo">Mock accounts: <strong>you / tracks</strong> or <strong>mara / plates</strong></p>
      </section>
    </main>
  )
}