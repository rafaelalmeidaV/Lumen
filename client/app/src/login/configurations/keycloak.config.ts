import type { KeycloakConfig } from '../types/Ikeycloak.config'

const env = (key: string, fallback: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv]
  return value ? String(value) : fallback
}

export const CONFIG: KeycloakConfig = {
  KEYCLOAK_BASE: env('VITE_KEYCLOAK_BASE_URL', 'http://lumen.auth.local'),
  REALM: env('VITE_KEYCLOAK_REALM', 'Lumen'),
  CLIENT_ID: env('VITE_CLIENT_ID', 'public'),
  REDIRECT_URI: env('VITE_KEYCLOAK_REDIRECT_URI', window.location.origin + '/'),
  CANDLES_API_URL: env('VITE_CANDLES_API_URL', 'http://lumen.candles.local')
}

export const AUTH_ENDPOINT =
  `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/auth`

export const TOKEN_ENDPOINT =
  `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/token`
