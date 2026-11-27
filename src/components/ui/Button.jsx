import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  title,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none border disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transform active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm hover:shadow',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm hover:border-slate-400',
    outline:
      'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-300 hover:border-blue-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-sm hover:shadow',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent hover:text-slate-900',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 h-8',
    md: 'text-[13px] px-3.5 py-2 h-9',
    lg: 'text-sm px-4 py-2.5 h-10',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}

export { Button };
