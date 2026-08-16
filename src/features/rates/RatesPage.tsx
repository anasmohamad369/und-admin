import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, History } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useFarmContext } from '../../context/FarmContext';
import { useLiveRates } from '../../hooks/useRates';
import { UpdateRateModal } from './UpdateRateModal';
import { rateWebSocketService } from '../../services/websocket.service';

export const RatesPage: React.FC = () => {
  const { selectedFarmId } = useFarmContext();
  const { data: liveRates = [], refetch } = useLiveRates(selectedFarmId);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [tickerActive, setTickerActive] = useState(true);

  // Subscribe to WebSocket live updates
  useEffect(() => {
    rateWebSocketService.connect();

    const unsubscribe = rateWebSocketService.subscribe(() => {
      if (tickerActive) {
        refetch();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tickerActive, refetch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Chicken Rates"
        subtitle="Manage live market chicken pricing across all farms (POST /api/v1/rates & GET /api/v1/rates/current)"
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/rates/history"
              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4 text-stone-500" />
              View Rate History
            </Link>
            <Link
              to="/rates/update"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              + Update Live Rate
            </Link>
          </div>
        }
      />

      {/* WebSocket Real-time Banner */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">
            Real-time WebSocket Rate Broadcast Event Listener Active (`/ws/live-rates`)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400">Simulate Live Ticker:</span>
          <button
            onClick={() => setTickerActive(!tickerActive)}
            className={`px-3 py-1 rounded-full font-bold transition-colors ${
              tickerActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-stone-800 text-stone-400'
            }`}
          >
            {tickerActive ? 'CONNECTED' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Hero Live Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveRates.length === 0 ? (
          <div className="col-span-4 p-8 bg-white rounded-2xl border border-stone-200 text-center text-stone-500 text-sm">
            No live rates published yet. Click <strong>Update Live Rate</strong> to publish the first rate.
          </div>
        ) : (
          liveRates.map((rate) => (
            <div
              key={rate.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-stone-700 uppercase tracking-wider">{rate.farmName || `Farm #${rate.farmId}`}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                  {(rate.chickenType || 'BROILER').replace('_', ' ')}
                </span>
              </div>

              <div className="my-3">
                <span className="text-3xl font-extrabold text-stone-900">₹{rate.ratePerKg}</span>
                <span className="text-xs text-stone-500 font-medium"> / KG</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                <span className="text-stone-500">Currency: {rate.currency || 'INR'}</span>
                <span className="font-bold text-emerald-600">
                  {rate.percentageChange != null ? `${rate.percentageChange >= 0 ? '+' : ''}${rate.percentageChange}%` : 'LIVE'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
                <p className="truncate">
                  <strong>Reason:</strong> {rate.reason || 'Market update'}
                </p>
                <p className="flex items-center gap-1 text-stone-500">
                  <Clock className="w-3 h-3" /> {rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live Rate Feed List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">Recent Live Rate Publications</h3>
          <span className="text-xs text-stone-500 font-medium">{liveRates.length} active rates</span>
        </div>

        <div className="divide-y divide-stone-200">
          {liveRates.map((r) => (
            <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{r.farmName || `Farm #${r.farmId}`}</span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-semibold text-emerald-700">{(r.chickenType || 'LIVE_CHICKEN').replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{r.reason || 'Market rate update'}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-lg font-bold text-stone-900">₹{r.ratePerKg} / KG</span>
                  <p className="text-[11px] text-stone-400">
                    Effective: {r.effectiveFrom ? new Date(r.effectiveFrom).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <Link
                  to="/rates/update"
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Update
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UpdateRateModal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} />
    </div>
  );
};
