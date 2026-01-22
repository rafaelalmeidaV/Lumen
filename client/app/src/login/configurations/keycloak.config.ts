import type { KeycloakConfig } from '../types/Ikeycloak.config'

export const CONFIG: KeycloakConfig = {
  KEYCLOAK_BASE: "http://lumen.auth.local",
  REALM: "Lumen",
  CLIENT_ID: "public",
  REDIRECT_URI: "http://lumen.client.local/"
}

export const AUTH_ENDPOINT = `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/auth`
export const TOKEN_ENDPOINT = `${CONFIG.KEYCLOAK_BASE}/realms/${CONFIG.REALM}/protocol/openid-connect/token`
