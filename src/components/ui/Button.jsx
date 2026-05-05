function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-500',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  info: 'bg-blue-600 text-white hover:bg-blue-500',
  warning: 'bg-amber-500 text-white hover:bg-amber-400',
  ghost: 'bg-transparent hover:bg-black/5',
}

const sizes = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    />
  )
}
