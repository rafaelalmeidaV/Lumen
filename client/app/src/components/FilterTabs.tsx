import type { CandleType } from '../candles/service/candles-service'

export type FilterOption = CandleType | 'all'

const FILTERS: Array<{ value: FilterOption; label: string; emoji: string }> = [
  { value: 'all', label: 'Todas', emoji: '✨' },
  { value: 'spiritual', label: 'Espiritual', emoji: '🕯️' },
  { value: 'health', label: 'Saúde', emoji: '💚' },
  { value: 'prosperity', label: 'Prosperidade', emoji: '💛' },
  { value: 'love', label: 'Amor', emoji: '❤️' },
]

interface FilterTabsProps {
  active: FilterOption
  onChange: (filter: FilterOption) => void
  counts: Partial<Record<FilterOption, number>>
}

export function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div
      className="sticky top-[57px] z-30 backdrop-blur-md overflow-x-auto"
      style={{
        background: 'rgba(15,11,20,0.88)',
        borderBottom: '1px solid rgba(245,200,66,0.08)',
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl gap-1 px-4 py-2 sm:px-6 lg:px-8">
        {FILTERS.map((f) => {
          const isActive = active === f.value
          const count = counts[f.value]
          return (
            <button
              key={f.value}
              onClick={() => onChange(f.value)}
              style={
                isActive
                  ? {
                      background: 'rgba(232,121,29,0.15)',
                      color: 'var(--ember)',
                      border: '1px solid rgba(232,121,29,0.35)',
                      fontWeight: 600,
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--ash)',
                      border: '1px solid transparent',
                      fontWeight: 400,
                    }
              }
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all hover:text-amber-400"
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className="font-mono-data rounded-full px-1.5 text-xs"
                  style={{
                    background: isActive ? 'rgba(232,121,29,0.2)' : 'rgba(139,125,107,0.15)',
                    color: isActive ? 'var(--ember)' : 'var(--ash)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
