import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  comparisonText?: string;
  highlight?: boolean;
  subValue?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  comparisonText = 'vs previous period',
  highlight = false,
  subValue,
}) => {
  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-brand-900 via-brand-850 to-slate-900 border-brand-800 text-white shadow-lg shadow-brand-950/20'
          : 'bg-white border-slate-200 text-slate-900 hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            highlight ? 'text-brand-200' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        <div
          className={`p-2.5 rounded-lg ${
            highlight
              ? 'bg-white/10 text-brand-300'
              : 'bg-slate-100 text-brand-700'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {subValue && (
          <span className={`text-xs ${highlight ? 'text-brand-300' : 'text-slate-500'}`}>
            {subValue}
          </span>
        )}
      </div>

      {(trend || comparisonText) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                trend.isPositive
                  ? highlight
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-emerald-50 text-emerald-700'
                  : highlight
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          <span
            className={`${
              highlight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {comparisonText}
          </span>
        </div>
      )}
    </div>
  );
};
