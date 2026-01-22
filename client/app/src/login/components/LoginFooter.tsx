import React from 'react'
import i18n from '../../locales/pt.json'

export const LoginFooter: React.FC = () => {
  return (
    <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 text-center">
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          {i18n.auth.login.footer}
        </p>
      </div>
    </div>
  )
}
