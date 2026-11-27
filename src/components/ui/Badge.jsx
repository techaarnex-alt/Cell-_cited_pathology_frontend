import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral'
  className = '',
  size = 'md', // 'sm' | 'md'
}) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[10.5px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold border rounded-full ${
        variantStyles[variant] || variantStyles.neutral
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
}

export { Badge };
