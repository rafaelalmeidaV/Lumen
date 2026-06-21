import { CONFIG } from '../../login/configurations/keycloak.config'

export type CandleType = 'love' | 'health' | 'prosperity' | 'spiritual'
export type BrazilState =
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO'
  | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI'
  | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO'

export interface Candle {
  ID?: string
  Id?: string
  id?: string
  City?: string
  city?: string
  State?: BrazilState
  state?: BrazilState
  CreatedAt?: string
  created_at?: string
  ExpiredAt?: string
  expired_at?: string
  Intention?: string
  intention?: string
  Type?: CandleType
  type?: CandleType
}

export interface CreateCandlePayload {
  city: string
  state: BrazilState
  duration_hours: number
  intention: string
  type: CandleType
}

const endpoint = (path: string): string => {
  return `${CONFIG.CANDLES_API_URL.replace(/\/$/, '')}${path}`
}

export const listCandles = async (): Promise<Candle[]> => {
  const response = await fetch(endpoint('/candles'))

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as velas')
  }

  const data = await response.json() as { candles?: Candle[] }
  return data.candles ?? []
}

export const createCandle = async (payload: CreateCandlePayload): Promise<void> => {
  const response = await fetch(endpoint('/candles'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel acender a vela')
  }
}
