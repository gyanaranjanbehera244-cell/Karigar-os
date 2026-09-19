import React from 'react';
import {
  ShieldCheck,
  Users,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const clusterMetrics = [
    { label: 'Total Verified Artisans', value: '482', change: '+12% this month' },
    { label: 'AI Supply Clusters Formed', value: '38', change: '100% On-time fulfillment' },
    { label: 'Avg Artisan Floor Protected', value: '₹1,680', change: 'Zero wage exploitation' },
    { label: 'Avg Image AI Score Boost', value: '+42%', change: 'From 52/100 to 94/100' },
  ];

  const recentLogs = [
    {
      time: '12 mins ago',
      action: 'AI Supply Cluster Created',
      details: '100 units Sambalpuri sarees pooled across 4 weavers in Bargarh cluster for Heritage Boutique.',
      status: 'Active',
    },
    {
      time: '28 mins ago',
      action: 'Voice Extraction Completed',
      details: 'Odia speech-to-text parsed 8 attributes + craft fingerprint for Meena Das with 96% confidence.',
      status: 'Success',
    },
    {
      time: '1 hour ago',
      action: 'Digital Craft Passport Minted',
      details: 'QR Code #DCP-SAMB-2026 deployed to public gateway for Pashmina Shawl & Sambalpuri Saree.',
      status: 'Verified',
    },
    {
      time: '2 hours ago',
      action: 'Price Floor Guardrail Triggered',
      details: 'Buyer bid of ₹1,400 blocked by floor guardrail (₹1,650 minimum). AI recommended counter-offer ₹1,880.',
      status: 'Protected',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Government & NGO Oversight Dashboard
              </span>
              <span className="text-xs text-stone-400 font-mono">
                SIH26090 Platform Monitor
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-serif mt-1">
              KARIGAR OS System Health & Cluster Analytics
            </h2>
            <p className="text-xs text-stone-400">
              Monitoring real-time multi-artisan collaborative supply clusters, pricing guardrails, and voice extraction accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400">
              Gemini 3.7 Vision + Audio Live
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clusterMetrics.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2 shadow-md"
          >
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              {kpi.label}
            </span>
            <div className="text-2xl font-extrabold font-mono text-stone-100">
              {kpi.value}
            </div>
            <span className="text-xs text-emerald-400 font-semibold block">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Real-time System Event Stream */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-serif">
              Real-time AI Pipeline & Security Logs
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Uptime: 99.98%
          </span>
        </div>

        <div className="space-y-3">
          {recentLogs.map((log, idx) => (
            <div
              key={idx}
              className="bg-stone-950 border border-stone-800/80 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-100">{log.action}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300">
                    {log.time}
                  </span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  {log.details}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/50 self-start sm:self-auto shrink-0">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
