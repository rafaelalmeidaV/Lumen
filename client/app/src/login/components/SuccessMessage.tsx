import React from 'react'
import i18n from '../../locales/pt.json'

export const SuccessMessage: React.FC = () => {
  return (
    <div className="text-center p-6 bg-green-50 rounded-2xl border-2 border-green-200">
      <div className="flex items-center justify-center gap-2 mb-2">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-lg font-semibold text-green-800">
          {i18n.auth.status.success}
        </span>
      </div>
      <p className="text-sm text-green-700">
        {i18n.auth.status.connectedMessage}
      </p>
    </div>
  )
}