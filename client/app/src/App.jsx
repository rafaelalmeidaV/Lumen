import { useState, useEffect } from 'react'
import { sha256 } from 'js-sha256'

function App() {
  const [tokens, setTokens] = useState(null)

  // Gera UUID (funciona em HTTP)
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Config
  const KEYCLOAK_BASE = "http://auth.local"
  const REALM = "Lumen"
  const CLIENT_ID = "public"
  const REDIRECT_URI = "http://client.local/"

  const AUTH_ENDPOINT = `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/auth`
  const TOKEN_ENDPOINT = `${KEYCLOAK_BASE}/realms/${REALM}/protocol/openid-connect/token`

  // PKCE helper
  const base64urlencode = (str) => {
    return btoa(String.fromCharCode(...new Uint8Array(str.match(/\w{2}/g).map(byte => parseInt(byte, 16)))))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  }

  // Login
  const login = () => {
    console.log('Login clicked!')
    
    const codeVerifier = generateUUID() + generateUUID()
    console.log('Code verifier:', codeVerifier)
    
    sessionStorage.setItem("code_verifier", codeVerifier)

    // Gera SHA256 do code_verifier
    const hash = sha256(codeVerifier)
    const codeChallenge = base64urlencode(hash)
    console.log('Code challenge:', codeChallenge)

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: "openid profile email",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    const authUrl = `${AUTH_ENDPOINT}?${params.toString()}`
    console.log('Redirecting to:', authUrl)
    
    window.location.href = authUrl
  }

  // Callback handler
  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")

      if (!code) return

      console.log('Handling callback with code:', code)

      const codeVerifier = sessionStorage.getItem("code_verifier")
      console.log('Code verifier from session:', codeVerifier)

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      })

      try {
        const res = await fetch(TOKEN_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        })

        const tokens = await res.json()
        console.log('Tokens received:', tokens)
        setTokens(tokens)

        // Limpa URL
        window.history.replaceState({}, document.title, "/")
      } catch (error) {
        console.error('Error fetching tokens:', error)
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Entrar com Keycloak
        </button>

        {tokens && (
          <pre className="text-xs mt-4 whitespace-pre-wrap overflow-auto max-h-64 bg-gray-50 p-2 rounded">
            {JSON.stringify(tokens, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default App