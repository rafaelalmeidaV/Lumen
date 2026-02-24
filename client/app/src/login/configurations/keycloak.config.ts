import type { KeycloakConfig } from '../types/Ikeycloak.config'

const requiredEnv = (key: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv]
  if (!value) {
    throw new Error(`Missing env variable: ${key}`)
  }
  return value as string
}

export const CONFIG: KeycloakConfig = {
  KEYCLOAK_BASE: requiredEnv('VITE_KEYCLOAK_BASE_URL'),
  REALM: requiredEnv('VITE_KEYCLOAK_REALM'),
  CLIENT_ID: requiredEnv('VITE_CLIENT_ID'),
  REDIRECT_URI: requiredEnv('VITE_KEYCLOAK_INTERNAL_URL')
}

export const AUTH_ENDPOINT =
  `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/auth`

export const TOKEN_ENDPOINT =
  `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/token`