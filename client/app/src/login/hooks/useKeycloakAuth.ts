import { useState, useEffect } from 'react'
import type { KeycloakTokens } from '../types/Ikeycloak.tokens'
import { login as loginService, handleCallback, getStoredTokens, logout as logoutService } from '../service/auth-service'

export const useKeycloakAuth = () => {
  const [tokens, setTokens] = useState<KeycloakTokens | null>(getStoredTokens)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processCallback = async (): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await handleCallback()
        if (data) {
          setTokens(data)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Falha ao autenticar')
      } finally {
        setIsLoading(false)
      }
    }
    processCallback()
  }, [])

  const login = () => {
    loginService()
  }

  const logout = () => {
    logoutService()
    setTokens(null)
  }

  return { tokens, isLoading, error, login, logout }
}
