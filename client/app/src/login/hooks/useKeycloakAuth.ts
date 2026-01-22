import { useState, useEffect } from 'react'
import type { KeycloakTokens } from '../types/Ikeycloak.tokens'
import { login as loginService, handleCallback } from '../service/auth-service'

export const useKeycloakAuth = () => {
  const [tokens, setTokens] = useState<KeycloakTokens | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const processCallback = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const data = await handleCallback()
        if (data) {
          setTokens(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    processCallback()
  }, [])

  const login = () => {
    loginService()
  }

  return { tokens, isLoading, login }
}
