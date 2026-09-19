import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Minus,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { DemandSignal } from '../../types';
import { api } from '../../services/api';

export const DemandRadarView: React.FC<{ onSelectRecommendedCraft?: (signal: DemandSignal) => void }> = ({
  onSelectRecommendedCraft,
}) => {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSignal, setSelectedSignal] = useState<DemandSignal | null>(null);

  useEffect(() => {
    async function loadDemand() {
      setLoading(true);
      const res = await api.getDemandSignals();
      setSignals(res.demandSignals);
      if (res.demandSignals.length > 0) {
        setSelectedSignal(res.demandSignals[0]);
      }
      setLoading(false);
    }
    loadDemand();
  }, []);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demand Intelligence
            </span>
            <h3 className="text-lg font-bold text-stone-100 font-serif">
              Demand Radar — "What should I make next?"
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Analyzing buyer search volume, regional sourcing requests, and price velocity from available craft market signals.
          </p>
        </div>

        <span className="text-[11px] text-stone-400 italic">
          *AI estimates based on demo market signals
        </span>
      </div>

      {/* Primary Highlight Recommendation */}
      <div className="bg-amber-950/30 border border-amber-600/50 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>KARIGAR AI Synthesis for Meena Das</span>
        </div>
        <p className="text-sm text-stone-200 leading-relaxed font-medium">
          "Based on your available product data and current buyer-interest signals, <strong>cotton Sambalpuri sarees</strong> and <strong>natural indigo dye dupattas</strong> appear to have the strongest demand. Consider weaving 4–6 additional pieces in the <strong>₹1,800–₹2,400</strong> range for the upcoming festive sourcing cycle."
        </p>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {signals.map((sig) => {
          const isHigh = sig.trend === 'HIGH';
          const isRising = sig.trend === 'RISING';

          return (
            <div
              key={sig.id}
              onClick={() => setSelectedSignal(sig)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                selectedSignal?.id === sig.id
                  ? 'bg-stone-950 border-amber-500/80 ring-1 ring-amber-500/30'
                  : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
              }`}
            >
              {/* Top Row: Category & Trend Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-stone-100">
                    {sig.category}
                  </h4>
                  <span className="text-xs text-stone-400">
                    {sig.craftType} • {sig.material}
                  </span>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                    isHigh
                      ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                      : isRising
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {isHigh || isRising ? <ArrowUpRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  <span>{sig.trend}</span>
                  <span className="font-mono text-[11px] font-normal opacity-80">
                    (+{sig.growthPercentage}%)
                  </span>
                </div>
              </div>

              {/* Price & Buyer Counts */}
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-stone-900/60 border border-stone-800/60">
                <span className="text-stone-400">
                  Target Price: <strong className="text-amber-300 font-mono">₹{sig.suggestedPriceRange.min}–₹{sig.suggestedPriceRange.max}</strong>
                </span>
                <span className="text-stone-400">
                  Leads: <strong className="text-emerald-400">{sig.sampleBuyerInterestCount} active</strong>
                </span>
              </div>

              {/* Recommendation snippet */}
              <p className="text-xs text-stone-300 leading-relaxed italic">
                "{sig.aiRecommendation}"
              </p>

              {/* Popular Color Palette Chips */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">
                  Trending Dyes:
                </span>
                {sig.popularColorPalette.map((col, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
