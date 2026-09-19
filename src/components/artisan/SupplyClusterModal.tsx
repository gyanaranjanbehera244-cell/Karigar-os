import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  X,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import { SupplyCluster } from '../../types';

interface SupplyClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: SupplyCluster;
  onConfirmCluster?: () => void;
}

export const SupplyClusterModal: React.FC<SupplyClusterModalProps> = ({
  isOpen,
  onClose,
  cluster,
  onConfirmCluster,
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (onConfirmCluster) {
      onConfirmCluster();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl shadow-amber-950/60 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH WOW Feature: AI Supply Cluster</span>
            </span>
          </div>
          <h3 className="text-xl font-bold text-stone-100 font-serif mt-2">
            Multi-Artisan Collaborative Fulfillment Cluster
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Buyer requested <strong className="text-amber-300">{cluster.requestedQuantity} units</strong>. Because single artisan capacity is 20 units/month, KARIGAR OS pooled 4 verified Sambalpuri weavers using Craft Fingerprint similarity.
          </p>
        </div>

        {/* Aggregate Cluster Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Pooled</span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              {cluster.matchedQuantity} Units
            </span>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Artisans</span>
            <span className="text-xl font-extrabold font-mono text-amber-400">
              {cluster.clusterMembers.length} Weavers
            </span>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Fulfillment</span>
            <span className="text-xl font-extrabold font-mono text-indigo-400">
              {cluster.estimatedFulfillmentDays} Days
            </span>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Cluster Price</span>
            <span className="text-xl font-extrabold font-mono text-stone-100">
              ₹1,880/unit
            </span>
          </div>
        </div>

        {/* Participating Artisans List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Participating Artisans in Cluster:
          </h4>
          <div className="space-y-2">
            {cluster.clusterMembers.map((member, idx) => (
              <div
                key={member.artisanId}
                className="bg-stone-950 border border-stone-800/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-800 text-amber-400 flex items-center justify-center font-bold text-xs border border-stone-700">
                    {idx === 0 ? 'Lead' : `#${idx + 1}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-stone-200">
                      <span>{member.artisanName}</span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">
                          You (Lead)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {member.location} • Match: {member.fingerprintMatch}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {member.allocatedUnits} units
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      Capacity: {member.availableCapacity}/mo
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-emerald-950/60 rounded text-[11px] font-semibold text-emerald-300 border border-emerald-800/40">
                    ₹{member.unitPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Cluster Protection Seal */}
        <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl flex items-start gap-3 text-xs text-stone-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-200">
              Harmonized Craft Fingerprint Guarantee
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              All 4 artisans use identical 100/100 combed cotton yarns, organic indigo/crimson dyes, and master weaver quality benchmarks verified in Bargarh.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <span className="text-[11px] text-stone-400 italic">
            *Prototype recommendation — requires artisan & buyer confirmation.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              id="confirm-cluster-btn"
              onClick={handleConfirm}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
              }`}
            >
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cluster Proposal Confirmed!</span>
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Confirm & Send 100-Unit Proposal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
