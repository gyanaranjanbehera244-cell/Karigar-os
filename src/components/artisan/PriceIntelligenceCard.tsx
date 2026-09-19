import React, { useState } from 'react';
import {
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { PriceBreakdown } from '../../types';

interface PriceIntelligenceCardProps {
  pricing: PriceBreakdown;
  onPriceChange?: (newPrice: number) => void;
}

export const PriceIntelligenceCard: React.FC<PriceIntelligenceCardProps> = ({
  pricing,
  onPriceChange,
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-serif">
                AI Price Intelligence
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                Confidence: {pricing.confidence || 'High'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Fair living wage + material cost + market benchmark price range.
            </p>
          </div>
        </div>

        {/* Disclaimer Tag */}
        <div className="text-[11px] text-stone-400 italic">
          *AI estimate based on craft benchmarks.
        </div>
      </div>

      {/* 3 Core Price Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tier 1: Artisan Floor Price */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
              Sustainable Artisan Floor
            </span>
            <div className="text-2xl font-bold font-mono text-stone-100 mt-1">
              ₹{(pricing.sustainableFloor || 1650).toLocaleString('en-IN')}
            </div>
          </div>
          <p className="text-[11px] text-stone-400">
            Absolute minimum to cover raw materials (₹{pricing.materialCost}) + 4-day living wage labor. Never sell below this.
          </p>
        </div>

        {/* Tier 2: Recommended Retail Price */}
        <div className="bg-amber-950/40 border-2 border-amber-600/80 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-lg shadow-amber-950/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                ★ Recommended Direct Price
              </span>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-900/60 px-1.5 py-0.5 rounded">
                Optimal Margin
              </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
              ₹{(pricing.recommendedPrice || 2199).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[11px] text-amber-200/80 font-medium">
            Range: ₹{(pricing.recommendedRange?.min || 2000).toLocaleString('en-IN')} – ₹{(pricing.recommendedRange?.max || 2400).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Tier 3: Wholesale B2B Price */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
              Wholesale B2B Price (15+ units)
            </span>
            <div className="text-2xl font-bold font-mono text-stone-100 mt-1">
              ₹{(pricing.wholesalePrice || 1900).toLocaleString('en-IN')}
            </div>
          </div>
          <p className="text-[11px] text-stone-400">
            For volume boutique orders. Assures sustainable ₹250/unit profit margin with bulk upfront cashflow.
          </p>
        </div>
      </div>

      {/* WHY THIS PRICE? Collapsible Breakdown */}
      <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-stone-200"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>WHY THIS PRICE? (Transparent Cost Breakdown)</span>
          </div>
          {showExplanation ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {showExplanation && (
          <div className="space-y-3 pt-2 text-xs">
            <p className="text-stone-300 leading-relaxed bg-stone-900/60 p-3 rounded-lg border border-stone-800/60">
              {pricing.explanation ||
                'Direct raw materials cost is ₹900, combined with 4 days of skilled artisanal handcraft benchmarked at ₹750 and eco-packaging (₹100), establishing a non-negotiable sustainable floor of ₹1,650. Based on comparable verified craft market benchmarks (₹1,800–₹2,600), the recommended direct-to-consumer price is ₹2,199 with a wholesale B2B tier of ₹1,900.'}
            </p>

            {/* Cost Items Table */}
            <div className="space-y-1.5">
              {(pricing.costItems || [
                { label: 'Raw Cotton & Natural Dye Yarns', amount: 900, description: 'Direct yarn materials' },
                { label: 'Artisan Skilled Labor (4 Days)', amount: 750, description: '₹187.5/day fair living wage benchmark' },
                { label: 'Eco Finishing & Packaging', amount: 100, description: 'Hand starching & muslin wrap' },
                { label: 'Artisan Profit & Skill Premium', amount: 449, description: 'Heritage Bandhakala technique premium' },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-stone-900/40 border border-stone-800/40"
                >
                  <div>
                    <span className="font-semibold text-stone-200">{item.label}</span>
                    <span className="text-[10px] text-stone-400 block">{item.description}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-100">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Market Comparison Benchmark Bar */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span>Comparable Demo Market Range:</span>
              <span className="font-mono font-semibold text-stone-200">
                ₹{(pricing.marketMin || 1800).toLocaleString('en-IN')} – ₹{(pricing.marketMax || 2600).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
