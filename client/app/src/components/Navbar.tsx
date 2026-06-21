import { FlameIcon } from './FlameIcon'

interface NavbarProps {
  userName: string
  isAuthenticated: boolean
  isLoading: boolean
  onLogin: () => void
  onLogout: () => void
  onLightCandle: () => void
}

export function Navbar({ userName, isAuthenticated, isLoading, onLogin, onLogout, onLightCandle }: NavbarProps) {
  return (
    <nav
      style={{ borderBottom: '1px solid rgba(245,200,66,0.12)', background: 'rgba(15,11,20,0.92)' }}
      className="sticky top-0 z-40 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5 no-underline" aria-label="Lumen — página inicial">
          <FlameIcon size={22} />
          <span
            className="font-display text-lg tracking-widest uppercase"
            style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}
          >
            Lumen
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={onLightCandle}
            style={{
              background: 'var(--ember)',
              color: 'var(--parchment)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
            }}
            className="hidden h-9 rounded-full px-4 sm:flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            🕯️ Acender vela
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span
                style={{ color: 'var(--ash)', fontSize: '0.8125rem' }}
                className="hidden sm:block"
              >
                {userName}
              </span>
              <button
                onClick={onLogout}
                style={{
                  border: '1px solid rgba(139,125,107,0.35)',
                  color: 'var(--ash)',
                  background: 'transparent',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
                className="h-9 rounded-full px-4 hover:border-amber-600 hover:text-amber-400 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              disabled={isLoading}
              style={{
                border: '1px solid rgba(245,200,66,0.3)',
                color: 'var(--gold)',
                background: 'transparent',
                fontSize: '0.8125rem',
                fontWeight: 500,
              }}
              className="h-9 rounded-full px-4 hover:bg-amber-400/10 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Conectando…' : 'Entrar'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
