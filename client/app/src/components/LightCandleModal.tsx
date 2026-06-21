import { useState } from 'react'
import type { BrazilState, CandleType, CreateCandlePayload } from '../candles/service/candles-service'

const CANDLE_TYPES: Array<{ value: CandleType; label: string; emoji: string; description: string }> = [
  { value: 'spiritual', label: 'Espiritual', emoji: '🕯️', description: 'Fé, proteção e presença' },
  { value: 'health', label: 'Saúde', emoji: '💚', description: 'Cura, vitalidade e bem-estar' },
  { value: 'prosperity', label: 'Prosperidade', emoji: '💛', description: 'Abundância e novos caminhos' },
  { value: 'love', label: 'Amor', emoji: '❤️', description: 'Conexão, afeto e harmonia' },
]

const DURATION_OPTIONS = [
  { value: 24, label: '24h' },
  { value: 48, label: '48h' },
  { value: 72, label: '72h' },
  { value: 168, label: '7 dias' },
]

const STATES: BrazilState[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

const initialForm: CreateCandlePayload = {
  city: '',
  state: 'SP',
  duration_hours: 24,
  intention: '',
  type: 'spiritual',
}

interface LightCandleModalProps {
  onClose: () => void
  onSubmit: (payload: CreateCandlePayload) => Promise<void>
}

export function LightCandleModal({ onClose, onSubmit }: LightCandleModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<CreateCandlePayload>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedType = CANDLE_TYPES.find((t) => t.value === form.type)!

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(form)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível acender a vela')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      style={{ background: 'rgba(8,5,12,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="modal-in w-full max-w-md rounded-2xl p-6 sm:p-7"
        style={{
          background: 'var(--smoke)',
          border: '1px solid rgba(245,200,66,0.14)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(232,121,29,0.08)',
        }}
      >
        {success ? (
          <SuccessView onClose={onClose} type={selectedType} />
        ) : (
          <>
            <ModalHeader step={step} onClose={onClose} />

            {step === 1 && (
              <TypeSelector
                form={form}
                setForm={setForm}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <IntentionForm
                form={form}
                setForm={setForm}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <ConfirmStep
                form={form}
                setForm={setForm}
                selectedType={selectedType}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ModalHeader({ step, onClose }: { step: number; onClose: () => void }) {
  const labels = ['Escolha a intenção', 'Escreva sua vela', 'Confirme e acenda']
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <p style={{ color: 'var(--ash)', fontSize: '0.75rem', letterSpacing: '0.1em' }} className="font-mono-data mb-1">
          PASSO {step} DE 3
        </p>
        <h2
          className="font-display"
          style={{ color: 'var(--parchment)', fontSize: '1.25rem', fontWeight: 600 }}
        >
          {labels[step - 1]}
        </h2>
      </div>
      <button
        onClick={onClose}
        style={{ color: 'var(--ash)', background: 'none', border: 'none', fontSize: '1.25rem', lineHeight: 1 }}
        className="hover:text-amber-400 transition-colors -mt-1 -mr-1 p-1"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}

function TypeSelector({
  form,
  setForm,
  onNext,
}: {
  form: CreateCandlePayload
  setForm: React.Dispatch<React.SetStateAction<CreateCandlePayload>>
  onNext: () => void
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {CANDLE_TYPES.map((type) => {
          const isSelected = form.type === type.value
          return (
            <button
              key={type.value}
              onClick={() => setForm((f) => ({ ...f, type: type.value }))}
              style={
                isSelected
                  ? {
                      background: 'rgba(232,121,29,0.14)',
                      border: '1.5px solid var(--ember)',
                      color: 'var(--parchment)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(139,125,107,0.2)',
                      color: 'var(--ash)',
                    }
              }
              className="flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-all hover:border-amber-600"
            >
              <span style={{ fontSize: '1.75rem' }}>{type.emoji}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isSelected ? 'var(--parchment)' : 'var(--ash)' }}>
                {type.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--ash)', lineHeight: 1.4 }}>
                {type.description}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        style={{ background: 'var(--ember)', color: 'var(--parchment)', border: 'none', fontWeight: 600 }}
        className="mt-5 h-11 w-full rounded-full text-sm hover:opacity-90 transition-opacity"
      >
        Próximo →
      </button>
    </div>
  )
}

function IntentionForm({
  form,
  setForm,
  onBack,
  onNext,
}: {
  form: CreateCandlePayload
  setForm: React.Dispatch<React.SetStateAction<CreateCandlePayload>>
  onBack: () => void
  onNext: () => void
}) {
  const canProceed = form.intention.trim().length > 0 && form.city.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span style={{ color: 'var(--ash)', fontSize: '0.8125rem', fontWeight: 500 }} className="mb-2 block">
          Sua intenção
        </span>
        <textarea
          value={form.intention}
          onChange={(e) => setForm((f) => ({ ...f, intention: e.target.value }))}
          placeholder="Escreva aqui o que carrega no coração…"
          rows={4}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,125,107,0.25)',
            color: 'var(--parchment)',
            borderRadius: '12px',
            resize: 'none',
            outline: 'none',
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--ember)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(139,125,107,0.25)' }}
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span style={{ color: 'var(--ash)', fontSize: '0.8125rem', fontWeight: 500 }} className="mb-2 block">
            Cidade
          </span>
          <input
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="Ex: São Paulo"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(139,125,107,0.25)',
              color: 'var(--parchment)',
              borderRadius: '12px',
              outline: 'none',
              width: '100%',
              height: '42px',
              padding: '0 0.875rem',
              fontSize: '0.875rem',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--ember)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(139,125,107,0.25)' }}
            required
          />
        </label>

        <label className="block">
          <span style={{ color: 'var(--ash)', fontSize: '0.8125rem', fontWeight: 500 }} className="mb-2 block">
            Estado
          </span>
          <select
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value as BrazilState }))}
            style={{
              background: '#1E1726',
              border: '1px solid rgba(139,125,107,0.25)',
              color: 'var(--parchment)',
              borderRadius: '12px',
              outline: 'none',
              width: '100%',
              height: '42px',
              padding: '0 0.875rem',
              fontSize: '0.875rem',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--ember)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(139,125,107,0.25)' }}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-3 mt-1">
        <button
          onClick={onBack}
          style={{ border: '1px solid rgba(139,125,107,0.3)', color: 'var(--ash)', background: 'transparent', fontWeight: 500 }}
          className="h-11 flex-1 rounded-full text-sm hover:border-amber-600 hover:text-amber-400 transition-colors"
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{ background: 'var(--ember)', color: 'var(--parchment)', border: 'none', fontWeight: 600 }}
          className="h-11 flex-[2] rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}

function ConfirmStep({
  form,
  setForm,
  selectedType,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: {
  form: CreateCandlePayload
  setForm: React.Dispatch<React.SetStateAction<CreateCandlePayload>>
  selectedType: { emoji: string; label: string }
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error: string | null
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p style={{ color: 'var(--ash)', fontSize: '0.8125rem', fontWeight: 500 }} className="mb-2">
          Por quanto tempo?
        </p>
        <div className="grid grid-cols-4 gap-2">
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = form.duration_hours === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setForm((f) => ({ ...f, duration_hours: opt.value }))}
                style={
                  isSelected
                    ? { background: 'rgba(232,121,29,0.14)', border: '1.5px solid var(--ember)', color: 'var(--ember)', fontWeight: 600 }
                    : { background: 'transparent', border: '1.5px solid rgba(139,125,107,0.2)', color: 'var(--ash)', fontWeight: 400 }
                }
                className="h-10 rounded-xl text-sm transition-all hover:border-amber-600"
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(232,121,29,0.07)', border: '1px solid rgba(232,121,29,0.14)' }}
      >
        <p style={{ color: 'var(--ash)', fontSize: '0.75rem', letterSpacing: '0.08em' }} className="font-mono-data mb-2">
          RESUMO
        </p>
        <p style={{ color: 'var(--parchment)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          {selectedType.emoji} {selectedType.label} · {form.city}, {form.state}
        </p>
        <p style={{ color: 'var(--ash)', fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: 1.55 }}>
          "{form.intention.length > 80 ? form.intention.slice(0, 80) + '…' : form.intention}"
        </p>
        <p style={{ color: 'var(--ash)', fontSize: '0.75rem', marginTop: '0.5rem' }} className="font-mono-data">
          Duração: {DURATION_OPTIONS.find((o) => o.value === form.duration_hours)?.label ?? `${form.duration_hours}h`}
        </p>
      </div>

      {error && (
        <p
          style={{
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.25)',
            color: '#fca5a5',
            borderRadius: '10px',
            padding: '0.625rem 0.875rem',
            fontSize: '0.8125rem',
          }}
        >
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          style={{ border: '1px solid rgba(139,125,107,0.3)', color: 'var(--ash)', background: 'transparent', fontWeight: 500 }}
          className="h-11 flex-1 rounded-full text-sm hover:border-amber-600 hover:text-amber-400 transition-colors disabled:opacity-40"
        >
          ← Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ background: 'var(--ember)', color: 'var(--parchment)', border: 'none', fontWeight: 600 }}
          className="h-11 flex-[2] rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Acendendo…' : '🕯️ Acender vela'}
        </button>
      </div>
    </div>
  )
}

function SuccessView({ onClose, type }: { onClose: () => void; type: { emoji: string; label: string } }) {
  return (
    <div className="flex flex-col items-center text-center py-4 toast-in">
      <span style={{ fontSize: '3rem' }}>{type.emoji}</span>
      <h2
        className="font-display mt-4"
        style={{ color: 'var(--gold)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '0.02em' }}
      >
        Vela acesa
      </h2>
      <p style={{ color: 'var(--ash)', fontSize: '0.9375rem', lineHeight: 1.65, marginTop: '0.75rem', maxWidth: '280px' }}>
        Sua intenção de <strong style={{ color: 'var(--parchment)' }}>{type.label.toLowerCase()}</strong> está agora no mural, em chama.
      </p>
      <button
        onClick={onClose}
        style={{ background: 'var(--ember)', color: 'var(--parchment)', border: 'none', fontWeight: 600 }}
        className="mt-6 h-11 rounded-full px-8 text-sm hover:opacity-90 transition-opacity"
      >
        Ver no mural
      </button>
    </div>
  )
}
