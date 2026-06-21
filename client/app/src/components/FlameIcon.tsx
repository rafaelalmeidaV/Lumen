export function FlameIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flame-icon ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 7 8 7 13C7 15.761 9.239 18 12 18C14.761 18 17 15.761 17 13C17 8 12 2 12 2Z"
        fill="url(#flame-outer)"
      />
      <path
        d="M12 8C12 8 9.5 11.5 9.5 13.5C9.5 14.881 10.619 16 12 16C13.381 16 14.5 14.881 14.5 13.5C14.5 11.5 12 8 12 8Z"
        fill="url(#flame-inner)"
      />
      <rect x="10" y="17.5" width="4" height="8" rx="2" fill="#5A3A1A" />
      <defs>
        <linearGradient id="flame-outer" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5C842" />
          <stop offset="55%" stopColor="#E8791D" />
          <stop offset="100%" stopColor="#C0390A" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="flame-inner" x1="12" y1="8" x2="12" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDE0" />
          <stop offset="100%" stopColor="#F5C842" />
        </linearGradient>
      </defs>
    </svg>
  )
}
