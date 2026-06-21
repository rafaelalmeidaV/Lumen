import { useEffect, useMemo, useState } from 'react'
import { createCandle, listCandles } from './candles/service/candles-service'
import type { Candle, CreateCandlePayload } from './candles/service/candles-service'
import { CONFIG } from './login/configurations/keycloak.config'
import { useKeycloakAuth } from './login/hooks/useKeycloakAuth'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CandleMural } from './components/CandleMural'
import { LightCandleModal } from './components/LightCandleModal'

function decodeName(token?: string): string {
  if (!token) return 'Visitante'
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { name?: string; preferred_username?: string; email?: string }
    return payload.name ?? payload.preferred_username ?? payload.email ?? 'Usuário'
  } catch {
    return 'Usuário'
  }
}

function App() {
  const { tokens, isLoading, error: authError, login, logout } = useKeycloakAuth()
  const [candles, setCandles] = useState<Candle[]>([])
  const [isLoadingCandles, setIsLoadingCandles] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const userName = useMemo(() => decodeName(tokens?.id_token), [tokens])
  const isAuthenticated = !!tokens

  const loadCandles = async () => {
    setIsLoadingCandles(true)
    try {
      const data = await listCandles()
      setCandles(data)
    } catch {
      // silent — mural mostra o estado vazio
    } finally {
      setIsLoadingCandles(false)
    }
  }

  useEffect(() => {
    loadCandles()
  }, [])

  const handleLightCandle = () => {
    setIsModalOpen(true)
  }

  const handleSubmitCandle = async (payload: CreateCandlePayload) => {
    await createCandle(payload)
    await loadCandles()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--midnight)' }}>
      {authError && (
        <div
          style={{
            background: 'rgba(220,38,38,0.12)',
            borderBottom: '1px solid rgba(220,38,38,0.25)',
            color: '#fca5a5',
            padding: '0.625rem 1rem',
            textAlign: 'center',
            fontSize: '0.8125rem',
          }}
        >
          {authError}
        </div>
      )}

      <Navbar
        userName={userName}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogin={login}
        onLogout={logout}
        onLightCandle={handleLightCandle}
      />

      <Hero
        candleCount={candles.length}
        onLightCandle={handleLightCandle}
      />

      <CandleMural
        candles={candles}
        isLoading={isLoadingCandles}
        onRefresh={loadCandles}
        onLightCandle={handleLightCandle}
      />

      <footer
        style={{
          borderTop: '1px solid rgba(245,200,66,0.08)',
          padding: '2rem 1rem',
          textAlign: 'center',
          color: 'var(--ash)',
          fontSize: '0.8125rem',
        }}
      >
        <span className="font-mono-data" style={{ letterSpacing: '0.06em' }}>
          {CONFIG.CANDLES_API_URL} · realm {CONFIG.REALM}
        </span>
      </footer>

      {isModalOpen && (
        <LightCandleModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (payload) => {
            await handleSubmitCandle(payload)
            setIsModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default App
