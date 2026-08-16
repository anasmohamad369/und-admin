import React from 'react';

type BadgeType =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'
  | 'PAID'
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'AVAILABLE'
  | 'ON_DELIVERY'
  | 'OFFLINE'
  | 'OPTIMAL'
  | 'LOW_STOCK'
  | 'CRITICAL';

interface StatusBadgeProps {
  status: BadgeType | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotStyle = 'bg-slate-400';

  switch (normalized) {
    case 'ACTIVE':
    case 'DELIVERED':
    case 'PAID':
    case 'AVAILABLE':
    case 'OPTIMAL':
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotStyle = 'bg-emerald-500';
      break;

    case 'PENDING':
    case 'OUT_FOR_DELIVERY':
    case 'ON_DELIVERY':
    case 'LOW_STOCK':
    case 'PARTIALLY_PAID':
      styles = 'bg-amber-50 text-amber-800 border-amber-200';
      dotStyle = 'bg-amber-500';
      break;

    case 'CONFIRMED':
    case 'ASSIGNED':
    case 'PICKED_UP':
      styles = 'bg-blue-50 text-blue-800 border-blue-200';
      dotStyle = 'bg-blue-500';
      break;

    case 'CANCELLED':
    case 'FAILED':
    case 'CRITICAL':
    case 'UNPAID':
    case 'BLOCKED':
    case 'DEACTIVATED':
    case 'INACTIVE':
      styles = 'bg-rose-50 text-rose-800 border-rose-200';
      dotStyle = 'bg-rose-500';
      break;

    case 'OFFLINE':
    case 'MAINTENANCE':
      styles = 'bg-slate-100 text-slate-600 border-slate-200';
      dotStyle = 'bg-slate-400';
      break;
  }

  const label = normalized.replace(/_/g, ' ');

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses} ${styles} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {label}
    </span>
  );
};
