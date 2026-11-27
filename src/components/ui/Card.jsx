import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all duration-150 ${
        hover
          ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  kicker,
  action,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-4 ${className}`}>
      <div>
        {kicker && (
          <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
            {kicker}
          </span>
        )}
        {title && (
          <h2 className="text-base font-bold text-slate-900 m-0 tracking-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-slate-500 m-0 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { Card };
