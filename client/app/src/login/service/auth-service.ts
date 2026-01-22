import { sha256 } from 'js-sha256'
import type { KeycloakTokens } from '../types/Ikeycloak.tokens'
import { CONFIG, AUTH_ENDPOINT, TOKEN_ENDPOINT } from '../configurations/keycloak.config'
import { generateUUID, base64urlencode } from '../configurations/crypto'

export const login = (): void => {
  const codeVerifier = generateUUID() + generateUUID()
  sessionStorage.setItem("code_verifier", codeVerifier)
  const hash = sha256(codeVerifier)
  const codeChallenge = base64urlencode(hash)

  const params = new URLSearchParams({
    client_id: CONFIG.CLIENT_ID,
    response_type: "code",
    redirect_uri: CONFIG.REDIRECT_URI,
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`
}

export const handleCallback = async (): Promise<KeycloakTokens | null> => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get("code")
  if (!code) return null

  const codeVerifier = sessionStorage.getItem("code_verifier")
  if (!codeVerifier) return null

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CONFIG.CLIENT_ID,
    code,
    redirect_uri: CONFIG.REDIRECT_URI,
    code_verifier: codeVerifier,
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  
  const data = await res.json() as KeycloakTokens
  window.history.replaceState({}, document.title, "/")
  return data
}
