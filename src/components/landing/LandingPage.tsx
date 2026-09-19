import React from 'react';
import {
  Sparkles,
  Camera,
  Mic,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  HelpCircle,
  DollarSign,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenDemo,
}) => {
  const faqs = [
    {
      q: 'Why not just use an existing marketplace like Amazon Karigar or Etsy?',
      a: 'Conventional marketplaces require literacy in English, manual form filling with 40+ fields, high commission rates (20–35%), and leave artisans vulnerable to predatory price negotiations. KARIGAR OS is an operating system owned by the artisan: Voice-first in native languages (Odia, Hindi), automatic image cleanup, fair pricing floors, and collaborative supply clusters.',
    },
    {
      q: 'How does KARIGAR OS ensure pricing is fair and sustainable?',
      a: 'We never output a single opaque number. Our Price Intelligence model calculates a non-negotiable Sustainable Floor Price based on raw yarn costs + fair daily living wage benchmarks for the artisan\'s specific region, plus an optimal Direct Retail Price and Wholesale B2B tier.',
    },
    {
      q: 'What is the "AI Supply Cluster" and why is it revolutionary?',
      a: 'Individual master artisans cannot fulfill bulk enterprise orders (e.g., 100 units when one weaver makes only 18/month). Our AI automatically matches and pools peer artisans using Craft Fingerprints to coordinate joint fulfillment while maintaining quality and fair wage distribution.',
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Smart India Hackathon 2026 • SIH26090</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 font-serif tracking-tight leading-tight">
          AI Business OS for Marginalized Artisans
        </h1>

        <p className="text-base sm:text-xl text-amber-200/80 font-medium max-w-2xl mx-auto">
          "Speak. Snap. Sell." — Turning craft knowledge into dignified livelihoods without typing a single form.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectRole('artisan')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-900/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Artisan OS (Meena Das)</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>3-Min Judge Demo</span>
          </button>
        </div>
      </section>

      {/* 4 Pillar Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-4">
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif">
            Voice-First Cataloging
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Speak in Odia, Hindi, or English. Multimodal Gemini extracts 8 structured attributes without tedious manual forms.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif">
            Price Intelligence
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Sustainable artisan floor (₹1,650) + recommended retail + wholesale B2B pricing with transparent "Why This Price?" logic.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif">
            AI Supply Clusters
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Pool 4+ peer weavers to fulfill large 100-unit boutique orders collaboratively, overcoming individual capacity limits.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif">
            Digital Craft Passport
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Verifiable QR code digital certificate embedding craft DNA, master weaver identity, and geographic origin proof.
          </p>
        </div>
      </section>

      {/* FAQs for SIH Judges */}
      <section className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            Frequently Asked Questions for Evaluation
          </h3>
          <p className="text-xs text-stone-400">
            Design principles, ethical AI constraints, and technical architecture.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-2 text-xs"
            >
              <h4 className="font-bold text-stone-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-stone-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
