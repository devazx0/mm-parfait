import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/admin', replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(username, password)
    setLoading(false)
    if (ok) navigate({ to: '/admin', replace: true })
  }

  return (
    <div
      className="bg-surface-container-lowest text-on-background font-body-md flex flex-col items-center justify-center relative overflow-hidden min-h-screen py-8 px-4"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-variant rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none" />

      <main style={{ width: '100%', maxWidth: '420px' }}>
        <div className="flex flex-col items-center" style={{ marginBottom: '40px' }}>
          <div
            className="rounded-full bg-primary-container flex items-center justify-center shadow-[0px_4px_20px_rgba(26,26,26,0.06)]"
            style={{ width: '80px', height: '80px', marginBottom: '24px' }}
          >
            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>local_cafe</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight text-center">MM Parfait</h1>
          <p className="font-body-md text-body-md text-secondary text-center" style={{ marginTop: '8px' }}>Secure Admin Portal</p>
        </div>

        <div
          className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-surface-variant w-full"
          style={{ padding: '24px' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-label-md text-label-md text-on-background" htmlFor="username">Email Address</label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute pointer-events-none text-secondary-fixed-dim"
                  style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px' }}
                >
                  person
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg font-body-md text-on-background placeholder:text-tertiary-fixed-dim focus:outline-none focus:border-on-background focus:ring-2 focus:ring-on-background/20 transition-colors"
                  id="username"
                  name="username"
                  placeholder="admin@mmparfait.com"
                  required
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    padding: '14px 16px 14px 52px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-background" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute pointer-events-none text-secondary-fixed-dim"
                  style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px' }}
                >
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg font-body-md text-on-background placeholder:text-tertiary-fixed-dim focus:outline-none focus:border-on-background focus:ring-2 focus:ring-on-background/20 transition-colors"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '14px 16px 14px 52px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary font-label-md font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ padding: '16px 24px', fontSize: '15px', marginTop: '4px' }}
            >
              <span>{loading ? 'Signing in...' : 'Login'}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </form>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={() => navigate({ to: '/' })}
            className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-on-background transition-colors bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back to Public Site
          </button>
        </div>
      </main>
    </div>
  )
}
