import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { Product, BuyerMatchResult } from '../../types';
import { api } from '../../services/api';

interface BuyerMatchingViewProps {
  product?: Product;
  onSelectBuyerForCluster?: (buyerMatch: BuyerMatchResult) => void;
  onRequestBulkCluster?: (buyerMatch: BuyerMatchResult) => void;
}

export const BuyerMatchingView: React.FC<BuyerMatchingViewProps> = ({
  product,
  onSelectBuyerForCluster,
  onRequestBulkCluster,
}) => {
  const [matches, setMatches] = useState<BuyerMatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerMatchResult | null>(null);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      const results = await api.getBuyerMatches(product);
      setMatches(results);
      if (results.length > 0) {
        setSelectedBuyer(results[0]);
      }
      setLoading(false);
    }
    loadMatches();
  }, [product]);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-serif">
                Find Buyers & Match Scores
              </h4>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                Deterministic SIH Formula
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Ranked by category (30%), craft (25%), material (15%), price (15%), MOQ (10%), region (5%).
            </p>
          </div>
        </div>

        <span className="text-xs text-amber-400 font-semibold">
          {matches.length} Verified Buyers Matched
        </span>
      </div>

      {/* Buyer Cards List */}
      {loading ? (
        <div className="p-8 text-center text-stone-400 text-xs">
          Calculating deterministic compatibility scores...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match, idx) => {
            const isSelected = selectedBuyer?.buyerId === match.buyerId;
            const isTop = idx === 0;

            return (
              <div
                key={match.buyerId}
                onClick={() => setSelectedBuyer(match)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-stone-950 border-amber-500/80 ring-1 ring-amber-500/30 shadow-md shadow-amber-950/50'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                }`}
              >
                {isTop && (
                  <div className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                    ★ Highest Match
                  </div>
                )}

                {/* Buyer Title & Score */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      <h5 className="text-sm font-bold text-stone-100">
                        {match.buyerName}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                      <span className="text-amber-400 font-medium">{match.buyerType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {match.location}
                      </span>
                    </div>
                  </div>

                  {/* Match Percentage Pill */}
                  <div className="text-right">
                    <div className="text-xl font-extrabold font-mono text-emerald-400">
                      {match.overallScore}%
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Matched Reasons Checklist */}
                <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/60 text-[11px] text-stone-300">
                  {match.matchedReasons.map((reason, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{reason.replace('✓', '').trim()}</span>
                    </div>
                  ))}
                </div>

                {/* Sourcing Details */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/80 text-stone-400">
                  <span>Min Order: <strong className="text-stone-200">{match.buyerMinOrder} units</strong></span>
                  <span>Target: <strong className="text-stone-200">{match.buyerTargetPrice}</strong></span>
                </div>

                {/* Direct Action */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRequestBulkCluster) {
                        onRequestBulkCluster(match);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Request 100-Unit Cluster</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
