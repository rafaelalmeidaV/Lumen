import { LoginHeader } from './login/components/LoginHeader'
import { LoginButton } from './login/components/LoginButton'
import { SuccessMessage } from './login/components/SuccessMessage'
import { LoginFooter } from './login/components/LoginFooter'
import { useKeycloakAuth } from './login/hooks/useKeycloakAuth'

function App() {
  const { tokens, isLoading, login } = useKeycloakAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-10">
            <LoginHeader />
            {!tokens ? (
              <LoginButton onClick={login} isLoading={isLoading} />
            ) : (
              <SuccessMessage />
            )}
          </div>
          <LoginFooter />
        </div>
      </div>
    </div>
  )
}

export default App