import { FlameIcon } from './FlameIcon'

interface HeroProps {
  candleCount: number
  onLightCandle: () => void
}

export function Hero({ candleCount, onLightCandle }: HeroProps) {
  return (
    <section
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 100%, rgba(232,121,29,0.12) 0%, transparent 70%),
          var(--midnight)
        `,
        borderBottom: '1px solid rgba(245,200,66,0.08)',
      }}
      className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 fade-in-up" style={{ animationDelay: '0.05s' }}>
          <FlameIcon size={32} />
          <span
            className="font-display text-xs tracking-[0.3em] uppercase"
            style={{ color: 'var(--gold)' }}
          >
            Lumen
          </span>
        </div>

        <h1
          className="font-display fade-in-up"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
            color: 'var(--parchment)',
            animationDelay: '0.1s',
          }}
        >
          Suas intenções,<br />
          <span style={{ color: 'var(--ember)' }}>em chama.</span>
        </h1>

        <p
          className="mt-5 max-w-md fade-in-up"
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--ash)',
            animationDelay: '0.18s',
          }}
        >
          Acenda uma vela virtual. Compartilhe sua intenção com a comunidade e mantenha-a viva por quanto tempo precisar.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row fade-in-up" style={{ animationDelay: '0.26s' }}>
          <button
            onClick={onLightCandle}
            style={{
              background: 'var(--ember)',
              color: 'var(--parchment)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              letterSpacing: '0.01em',
            }}
            className="h-12 rounded-full px-7 hover:opacity-90 active:scale-95 transition-all"
          >
            🕯️ Acender uma vela
          </button>
        </div>

        {candleCount > 0 && (
          <p
            className="mt-8 fade-in-up font-mono-data"
            style={{
              color: 'var(--ash)',
              fontSize: '0.8125rem',
              letterSpacing: '0.06em',
              animationDelay: '0.34s',
            }}
          >
            <span style={{ color: 'var(--gold)' }}>{candleCount}</span>{' '}
            {candleCount === 1 ? 'vela ativa' : 'velas ativas'} agora
          </p>
        )}
      </div>
    </section>
  )
}
