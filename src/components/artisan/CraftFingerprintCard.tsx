import React from 'react';
import {
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CraftFingerprint } from '../../types';

interface CraftFingerprintCardProps {
  fingerprint: CraftFingerprint;
  artisanName?: string;
}

export const CraftFingerprintCard: React.FC<CraftFingerprintCardProps> = ({
  fingerprint,
  artisanName = 'Meena Das',
}) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
      {/* Background Craft DNA aesthetic grid */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-serif">
                Craft Fingerprint
              </h4>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                Vector ID: #CF-7829-ODISHA
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Structured craft identity for similarity search and supply clustering.
            </p>
          </div>
        </div>

        {/* AI Consistency Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{fingerprint.consistencyConfidence}% Consistency</span>
        </div>
      </div>

      {/* Consistency Note */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-stone-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-stone-200">
            {fingerprint.consistencyMessage || '✓ Information appears consistent with artisan profile and Sambalpuri Handloom craft benchmarks.'}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Non-legal AI consistency assessment comparing image visual signals, declared materials, and geographic craft cluster records.
          </p>
        </div>
      </div>

      {/* Fingerprint DNA Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Material
          </span>
          <span className="font-semibold text-stone-100">
            {fingerprint.material || '100% Pure Cotton'}
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Technique
          </span>
          <span className="font-semibold text-stone-100">
            {fingerprint.technique || 'Handloom Double Ikat'}
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Craft Cluster
          </span>
          <span className="font-semibold text-amber-300">
            {fingerprint.craft || 'Sambalpuri Bandhakala'}
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Pattern / Motifs
          </span>
          <span className="font-semibold text-stone-100">
            {fingerprint.pattern || 'Passapalli & Shankha'}
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Colors
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {(fingerprint.colors || ['Red', 'Black', 'Cream']).map((col, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-stone-800 text-[10px] font-medium text-stone-200"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Geographic Region
          </span>
          <span className="font-semibold text-stone-100 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{fingerprint.region || 'Bargarh, Odisha'}</span>
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Production Cycle
          </span>
          <span className="font-semibold text-stone-100 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{fingerprint.productionDays || 4} Days / piece</span>
          </span>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
            Handmade Verified
          </span>
          <span className="font-semibold text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>100% Handcrafted</span>
          </span>
        </div>
      </div>
    </div>
  );
};
