import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, History, AlertCircle, Sparkles, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useFarms } from '../../hooks/useFarms';
import { useLiveRates } from '../../hooks/useRates';
import { rateWebSocketService } from '../../services/websocket.service';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';

export const RatesPage: React.FC = () => {
  const { data: farms = [] } = useFarms();
  const [selectedFarmId, setSelectedFarmId] = useState<string>('ALL');
  const { data: liveRates = [], isLoading, refetch } = useLiveRates(selectedFarmId);
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
        title="Live Chicken Pricing Dashboard"
        subtitle="Real-time market rate monitoring & instant WebSocket price publication (/api/v1/rates)"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/rates/history">
              <Button variant="outline">
                <History className="w-4 h-4 mr-1.5 text-stone-500" /> View Rate History Timeline
              </Button>
            </Link>
            <Link to="/rates/update">
              <Button size="lg">
                <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-400" /> + Publish New Live Rate
              </Button>
            </Link>
          </div>
        }
      />

      {/* WebSocket Real-time Ticker Banner */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <p className="text-xs font-bold text-white">WebSocket Broadcast Engine Active (`/ws/live-rates`)</p>
            <p className="text-[11px] text-stone-400">
              Live rates published here automatically sync to all registered Retailer mobile apps in real-time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white" onClick={() => refetch()}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <button
            onClick={() => setTickerActive(!tickerActive)}
            className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
              tickerActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-stone-800 text-stone-400'
            }`}
          >
            {tickerActive ? 'WEBSOCKET: CONNECTED' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Farm Hub Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-700" /> Filter Active Rates by Farm Hub:
        </div>
        <div className="w-full md:w-72">
          <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger>
              <SelectValue placeholder="Select farm filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">🌐 All Farm Hubs (GET /rates?farmId=ALL)</SelectItem>
              {farms.map((f) => (
                <SelectItem key={String(f.id)} value={String(f.id)}>
                  🏡 {f.name} ({f.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hero Live Rate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-4 text-center py-12 text-stone-500 font-semibold text-sm">
            Loading live rate feeds...
          </div>
        ) : liveRates.length === 0 ? (
          <Card className="col-span-4 p-8 text-center border-stone-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">No Rates Found for Selected Filter</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Publish a live rate per KG to initiate the market pricing ledger for this farm hub.
            </p>
            <Link to="/rates/update">
              <Button>Publish Rate Now →</Button>
            </Link>
          </Card>
        ) : (
          liveRates.map((rate) => (
            <Card key={String(rate.id)} className="relative overflow-hidden hover:shadow-md transition-all border-stone-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-stone-800 uppercase tracking-wider truncate max-w-[140px]">
                    {rate.farmName || `Farm #${rate.farmId}`}
                  </span>
                  <Badge variant="brand">
                    {rate.status || 'ACTIVE'}
                  </Badge>
                </div>

                <div className="my-2 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-stone-900">₹{rate.ratePerKg || rate.currentRate}</span>
                    <span className="text-xs text-stone-500 font-extrabold">/ KG</span>
                  </div>

                  {(rate.originalRatePerKg || rate.originalRate) && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400 line-through font-medium">
                        ₹{rate.originalRatePerKg || rate.originalRate} / KG
                      </span>
                      {rate.discountPerKg != null && rate.discountPerKg > 0 && (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                          -₹{rate.discountPerKg} OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                  <span className="text-stone-500">Chicken Type:</span>
                  <span className="font-bold text-emerald-800">
                    {rate.chickenType ? rate.chickenType.replace('_', ' ') : `Type #${rate.chickenTypeId || 3}`}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                  <p className="truncate" title={rate.reason}>
                    <strong>Reason:</strong> {rate.reason || 'Market update'}
                  </p>
                  <p className="flex items-center gap-1 text-stone-400">
                    <Clock className="w-3 h-3" />
                    {rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Live Rate Feed List Table */}
      <Card>
        <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Active Rate Publications Ledger</h3>
            <p className="text-xs text-stone-500">GET /api/v1/rates?farmId={selectedFarmId}</p>
          </div>
          <Badge variant="secondary">{liveRates.length} Active Feeds</Badge>
        </div>

        <CardContent className="p-0 divide-y divide-stone-100">
          {liveRates.map((r) => (
            <div key={String(r.id)} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-stone-900 text-sm">{r.farmName || `Farm Hub #${r.farmId}`}</span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {r.chickenType ? r.chickenType.replace('_', ' ') : `Chicken Type #${r.chickenTypeId || 3}`}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{r.reason || 'Market price update'}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-lg font-black text-stone-900">₹{r.ratePerKg || r.currentRate} / KG</span>
                    {(r.originalRatePerKg || r.originalRate) && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{r.originalRatePerKg || r.originalRate}
                      </span>
                    )}
                  </div>
                  {r.discountPerKg != null && r.discountPerKg > 0 && (
                    <p className="text-[11px] text-emerald-700 font-bold">
                      ₹{r.discountPerKg} Flat Discount / KG
                    </p>
                  )}
                  <p className="text-[10px] text-stone-400 font-mono">
                    {r.effectiveFrom ? new Date(r.effectiveFrom).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <Link to="/rates/update">
                  <Button variant="outline" size="sm">
                    Revise Rate
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
