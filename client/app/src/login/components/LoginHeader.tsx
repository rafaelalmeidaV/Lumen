import React from 'react'
import i18n from '../../locales/pt.json'

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-3">
        {i18n.auth.login.title}
      </h1>
      <p className="text-slate-600 text-base">
        {i18n.auth.login.subtitle}
      </p>
    </div>
  )
}