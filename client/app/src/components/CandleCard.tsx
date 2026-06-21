import type { Candle } from '../candles/service/candles-service'

const CANDLE_EMOJI: Record<string, string> = {
  spiritual: '🕯️',
  health: '💚',
  prosperity: '💛',
  love: '❤️',
}

const CANDLE_LABEL: Record<string, string> = {
  spiritual: 'Espiritual',
  health: 'Saúde',
  prosperity: 'Prosperidade',
  love: 'Amor',
}

function valueOf(candle: Candle, pascal: keyof Candle, camel: keyof Candle): string {
  const value = candle[pascal] ?? candle[camel]
  return typeof value === 'string' ? value : ''
}

function formatDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

interface CandleCardProps {
  candle: Candle
  index: number
}

export function CandleCard({ candle, index }: CandleCardProps) {
  const intention = valueOf(candle, 'Intention', 'intention')
  const city = valueOf(candle, 'City', 'city')
  const state = valueOf(candle, 'State', 'state')
  const type = valueOf(candle, 'Type', 'type') || 'spiritual'
  const expiresAt = valueOf(candle, 'ExpiredAt', 'expired_at')
  const expiryLabel = formatDate(expiresAt)

  const emoji = CANDLE_EMOJI[type] ?? '🕯️'
  const label = CANDLE_LABEL[type] ?? type

  return (
    <article
      className="candle-card fade-in-up rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--smoke)',
        border: '1px solid rgba(245,200,66,0.10)',
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            background: 'rgba(232,121,29,0.12)',
            color: 'var(--ember)',
            border: '1px solid rgba(232,121,29,0.2)',
          }}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </span>

        {expiryLabel && (
          <span
            className="font-mono-data shrink-0"
            style={{ color: 'var(--ash)', fontSize: '0.6875rem', letterSpacing: '0.04em' }}
          >
            até {expiryLabel}
          </span>
        )}
      </div>

      <p
        style={{
          color: 'var(--parchment)',
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {intention}
      </p>

      {(city || state) && (
        <p
          className="font-mono-data"
          style={{ color: 'var(--ash)', fontSize: '0.75rem', letterSpacing: '0.05em' }}
        >
          {city}{state ? `, ${state}` : ''}
        </p>
      )}
    </article>
  )
}
