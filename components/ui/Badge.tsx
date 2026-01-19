interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'

  const variants = {
    default: 'bg-slate-700/50 text-slate-300',
    accent: 'bg-accent/20 text-accent border border-accent/30',
    outline: 'border border-slate-600 text-slate-400',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
