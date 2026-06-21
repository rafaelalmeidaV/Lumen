import { useState } from 'react'
import type { Candle, CandleType } from '../candles/service/candles-service'
import { CandleCard } from './CandleCard'
import { FilterTabs } from './FilterTabs'
import type { FilterOption } from './FilterTabs'

interface CandleMuralProps {
  candles: Candle[]
  isLoading: boolean
  onRefresh: () => void
  onLightCandle: () => void
}

function valueOf(candle: Candle, pascal: keyof Candle, camel: keyof Candle): string {
  const value = candle[pascal] ?? candle[camel]
  return typeof value === 'string' ? value : ''
}

export function CandleMural({ candles, isLoading, onRefresh, onLightCandle }: CandleMuralProps) {
  const [filter, setFilter] = useState<FilterOption>('all')

  const counts: Partial<Record<FilterOption, number>> = {
    all: candles.length,
    spiritual: candles.filter((c) => (valueOf(c, 'Type', 'type') || 'spiritual') === 'spiritual').length,
    health: candles.filter((c) => valueOf(c, 'Type', 'type') === 'health').length,
    prosperity: candles.filter((c) => valueOf(c, 'Type', 'type') === 'prosperity').length,
    love: candles.filter((c) => valueOf(c, 'Type', 'type') === 'love').length,
  }

  const filtered = filter === 'all'
    ? candles
    : candles.filter((c) => (valueOf(c, 'Type', 'type') || 'spiritual') === (filter as CandleType))

  return (
    <section>
      <FilterTabs active={filter} onChange={setFilter} counts={counts} />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="font-display"
            style={{ color: 'var(--parchment)', fontSize: '1.125rem', fontWeight: 600, letterSpacing: '0.05em' }}
          >
            Mural de intenções
          </h2>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            style={{
              border: '1px solid rgba(139,125,107,0.3)',
              color: 'var(--ash)',
              background: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
            className="h-8 rounded-full px-3.5 hover:border-amber-600 hover:text-amber-400 transition-colors disabled:opacity-40"
          >
            {isLoading ? 'Carregando…' : '↻ Atualizar'}
          </button>
        </div>

        {isLoading && candles.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{
                  background: 'var(--smoke)',
                  border: '1px solid rgba(245,200,66,0.06)',
                  height: '160px',
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
            style={{ border: '1px dashed rgba(139,125,107,0.25)' }}
          >
            <span style={{ fontSize: '2.5rem' }}>🕯️</span>
            <p style={{ color: 'var(--ash)', marginTop: '1rem', fontSize: '0.9375rem' }}>
              {filter === 'all'
                ? 'Nenhuma vela acesa ainda.'
                : `Nenhuma vela de ${filter} acesa ainda.`}
            </p>
            <button
              onClick={onLightCandle}
              style={{
                marginTop: '1.25rem',
                background: 'var(--ember)',
                color: 'var(--parchment)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
              className="h-10 rounded-full px-5 hover:opacity-90 transition-opacity"
            >
              Ser o primeiro a acender
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((candle, index) => {
              const id = (candle['ID' as keyof Candle] ?? candle['id' as keyof Candle] ?? index) as string | number
              return <CandleCard key={String(id)} candle={candle} index={index} />
            })}
          </div>
        )}
      </div>
    </section>
  )
}
