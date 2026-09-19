import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  Sparkles,
  Camera,
  Mic,
  DollarSign,
  Users,
  Award,
  X,
  ArrowRight,
} from 'lucide-react';

interface JudgeDemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (stepKey: string) => void;
}

export const JudgeDemoGuide: React.FC<JudgeDemoGuideProps> = ({
  isOpen,
  onClose,
  onJumpToStep,
}) => {
  const [activeSegment, setActiveSegment] = useState<number>(0);

  if (!isOpen) return null;

  const demoTimeline = [
    {
      time: '0:00 - 0:45',
      title: '1. The Problem & Voice/Snap Input',
      desc: 'Artisans cannot type complex e-commerce forms. Watch Odia/Hindi voice transcription & AI Image Studio boost readiness from 54 to 94.',
      actionKey: 'add_product',
      actionLabel: 'Launch Product Wizard',
    },
    {
      time: '0:45 - 1:30',
      title: '2. Craft Fingerprint & AI Consistency',
      desc: 'Zero fake numbers: Extracts 8 structured attributes and calculates non-legal AI consistency check (96% Confidence).',
      actionKey: 'craft_fingerprint',
      actionLabel: 'View Craft Fingerprint',
    },
    {
      time: '1:30 - 2:15',
      title: '3. Explainable Pricing Intelligence',
      desc: 'Transparent formula: Sustainable Floor (₹1,650) + Recommended (₹2,199) + Wholesale (₹1,900) with "Why This Price?" cost breakdown.',
      actionKey: 'pricing',
      actionLabel: 'View Price Intelligence',
    },
    {
      time: '2:15 - 2:45',
      title: '4. WOW Feature: AI Supply Cluster',
      desc: 'Buyer wants 100 units; single weaver capacity is 20. KARIGAR OS pools 4 peer weavers in Bargarh to unlock enterprise scale!',
      actionKey: 'supply_cluster',
      actionLabel: 'Simulate 100-Unit Cluster',
    },
    {
      time: '2:45 - 3:00',
      title: '5. Digital Craft Passport & QR Seal',
      desc: 'Publicly verifiable digital identity for handloom heritage, origin verification, and buyer trust.',
      actionKey: 'craft_passport',
      actionLabel: 'Inspect QR Passport',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl shadow-amber-950/60 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart India Hackathon SIH26090</span>
            </span>
          </div>
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            3-Minute Judge Evaluation Walkthrough
          </h3>
          <p className="text-xs text-stone-400">
            Click any milestone below to instantly jump to that part of the application flow.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {demoTimeline.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeSegment === idx
                  ? 'bg-stone-950 border-amber-500/80 ring-1 ring-amber-500/30'
                  : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-stone-800 px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                  <h4 className="text-sm font-bold text-stone-100">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveSegment(idx);
                  onJumpToStep(item.actionKey);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
