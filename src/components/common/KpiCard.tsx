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
      className={`rounded-2xl border p-5 transition-all duration-300 card-hover-lift ${
        highlight
          ? 'bg-gradient-to-br from-[#0c3520] via-[#092617] to-[#1a0f07] border-emerald-800/80 text-white shadow-xl glow-emerald'
          : 'bg-white/90 backdrop-blur-md border-slate-200/80 text-slate-900 shadow-xs hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-extrabold uppercase tracking-wider ${
            highlight ? 'text-orange-400' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        <div
          className={`p-2.5 rounded-xl transition-colors ${
            highlight
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black tracking-tight">{value}</span>
        {subValue && (
          <span className={`text-xs ${highlight ? 'text-orange-300' : 'text-slate-500'}`}>
            {subValue}
          </span>
        )}
      </div>

      {(trend || comparisonText) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border ${
                trend.isPositive
                  ? highlight
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : highlight
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              {trend.value}
            </span>
          )}
          <span
            className={`font-medium ${
              highlight ? 'text-emerald-200/70' : 'text-slate-500'
            }`}
          >
            {comparisonText}
          </span>
        </div>
      )}
    </div>
  );
};
