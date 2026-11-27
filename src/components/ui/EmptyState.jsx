import React from 'react';
import { LuInbox } from 'react-icons/lu';
import Button from './Button';

export default function EmptyState({
  icon: Icon = LuInbox,
  title = 'No records found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 m-0 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 m-0 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
