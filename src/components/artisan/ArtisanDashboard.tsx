import React, { useState, useEffect } from 'react';
import {
  Camera,
  Mic,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Users,
  MessageSquare,
  QrCode,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
} from 'lucide-react';
import { useLanguage } from '../common/LanguageContext';
import { AddProductWizard } from './AddProductWizard';
import { DemandRadarView } from './DemandRadarView';
import { AskKarigarChat } from './AskKarigarChat';
import { CraftStoryView } from './CraftStoryView';
import { DigitalCraftPassportModal } from './DigitalCraftPassportModal';
import { SupplyClusterModal } from './SupplyClusterModal';
import { createSupplyCluster } from '../../utils/supplyCluster';
import { Product, ArtisanProfile, Lead } from '../../types';
import { api } from '../../services/api';

export const ArtisanDashboard: React.FC<{ onOpenJudgeDemo: () => void }> = ({ onOpenJudgeDemo }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'radar' | 'chat' | 'story' | 'leads'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [selectedPassportProduct, setSelectedPassportProduct] = useState<Product | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [negotiationAdvice, setNegotiationAdvice] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, prof, incomingLeads] = await Promise.all([
        api.getProducts(),
        api.getArtisanProfile(),
        api.getLeads(),
      ]);
      setProducts(prods);
      setProfile(prof);
      setLeads(incomingLeads);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleProductCreated = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setActiveTab('products');
  };

  const handleTriggerClusterFromLead = (lead: Lead) => {
    const cluster = createSupplyCluster(
      undefined,
      lead.quantity || 100,
      lead.productTitle || 'Sambalpuri Cotton Sarees',
      lead.buyerName,
      lead.buyerId
    );
    setSelectedCluster(cluster);
  };

  const handleGetNegotiationAdvice = async (lead: Lead) => {
    const advice = await api.getNegotiationAdvice(
      lead.offeredPrice || 1750,
      1650, // Floor
      2199, // Recommended
      lead.quantity || 100
    );
    setNegotiationAdvice((prev) => ({
      ...prev,
      [lead.id]: advice.aiAdvice,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Artisan Digital Twin Bar */}
      {profile && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Artisan Avatar & Bio */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-stone-950 p-1 rounded-full text-[10px] font-bold">
                  ✓
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif">
                    {profile.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Master Artisan Twin Active
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  {profile.craft} • {profile.village}, {profile.district}, {profile.state} ({profile.experienceYears} Years Heritage)
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
                  <span>Capacity: <strong className="text-amber-400 font-mono">{profile.monthlyCapacityUnits} units/month</strong></span>
                  <span>•</span>
                  <span>Typical Price: <strong className="text-stone-100 font-mono">₹{profile.typicalPriceRange.min}–₹{profile.typicalPriceRange.max}</strong></span>
                </div>
              </div>
            </div>

            {/* Fast Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-add-product-main"
                onClick={() => setActiveTab('add')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-900/40 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>+ {t('add_product')}</span>
              </button>

              <button
                id="btn-demand-radar"
                onClick={() => setActiveTab('radar')}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-2 border border-stone-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{t('demand_radar')}</span>
              </button>

              <button
                id="btn-ask-ai"
                onClick={() => setActiveTab('chat')}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-2 border border-stone-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('ask_karigar')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-800 text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          My Published Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'add'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>New Product Wizard (P0 Flow)</span>
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'leads'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Buyer Orders & Negotiation ({leads.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'radar'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Demand Radar</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask KARIGAR AI</span>
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'story'
              ? 'bg-amber-600 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <span>Craft Story Twin</span>
        </button>
      </div>

      {/* TAB CONTENT: ADD PRODUCT WIZARD */}
      {activeTab === 'add' && (
        <AddProductWizard
          onProductCreated={handleProductCreated}
          onCancel={() => setActiveTab('products')}
        />
      )}

      {/* TAB CONTENT: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 font-serif">
              Active Inventory & Verified Handlooms
            </h3>
            <button
              onClick={() => setActiveTab('add')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>+ Add another product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-600/40 transition-all flex flex-col justify-between group shadow-md"
              >
                {/* Image + Score Badge */}
                <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                  <img
                    src={product.processedImageUrl || product.originalImageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-105"
                  />
                  {/* AI Readiness Score pill */}
                  <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-amber-400 border border-stone-800 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>AI Score: {product.imageReadinessScore || 94}/100</span>
                  </div>

                  {/* Passport Action Pill */}
                  <button
                    onClick={() => setSelectedPassportProduct(product)}
                    className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-400 text-stone-950 p-1.5 rounded-lg shadow-md transition-all flex items-center gap-1 text-[11px] font-bold"
                    title="View Digital Craft Passport QR"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Passport</span>
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                      <span>{product.craftType}</span>
                      <span>•</span>
                      <span>{product.productionTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-100 leading-snug line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2">
                      {product.descriptionEn}
                    </p>
                  </div>

                  {/* Fingerprint Mini Tags */}
                  <div className="flex flex-wrap gap-1 text-[10px] text-stone-300">
                    <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      {product.material}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                      {product.pattern}
                    </span>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">
                        Recommended Retail
                      </span>
                      <div className="text-lg font-bold font-mono text-amber-400">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPassportProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>QR Certificate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BUYER LEADS & NEGOTIATION */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Incoming Buyer Requests & AI Negotiation Advisor
              </h3>
              <p className="text-xs text-stone-400">
                Never get underpaid. AI protects your sustainable floor wage of ₹1,650 and coordinates bulk fulfillment.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-stone-100">
                        {lead.buyerName} ({lead.buyerType})
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        Quantity: {lead.quantity} units
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Requested: {lead.productTitle} • Offerer Target: <strong className="text-stone-200 font-mono">₹{lead.offeredPrice}/unit</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Total Order Value:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ₹{((lead.quantity || 1) * (lead.offeredPrice || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* AI Negotiation Advisor Widget */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>KARIGAR AI Negotiation Intelligence</span>
                    </span>
                    <button
                      onClick={() => handleGetNegotiationAdvice(lead)}
                      className="text-[11px] text-stone-400 hover:text-amber-300 underline"
                    >
                      Refresh Advice
                    </button>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-medium">
                    {negotiationAdvice[lead.id] ||
                      lead.negotiationNote ||
                      `Offered price ₹${lead.offeredPrice} is viable for bulk volume, but single artisan monthly capacity is 20 units. Use AI Supply Cluster to fulfill 100 units collaboratively across Bargarh weavers at ₹1,880/unit.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-stone-400">
                    Artisan Floor: <strong className="text-rose-400 font-mono">₹1,650</strong> • Retail: <strong className="text-amber-400 font-mono">₹2,199</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTriggerClusterFromLead(lead)}
                      className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Create AI Supply Cluster ({lead.quantity} units)</span>
                    </button>

                    <button
                      onClick={() => alert(`Counter-offer of ₹1,880 sent to ${lead.buyerName}!`)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-all"
                    >
                      Send ₹1,880 Counter-Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEMAND RADAR */}
      {activeTab === 'radar' && <DemandRadarView />}

      {/* TAB CONTENT: ASK KARIGAR AI */}
      {activeTab === 'chat' && <AskKarigarChat />}

      {/* TAB CONTENT: CRAFT STORY */}
      {activeTab === 'story' && profile && <CraftStoryView profile={profile} />}

      {/* Passport Modal */}
      {selectedPassportProduct && (
        <DigitalCraftPassportModal
          isOpen={!!selectedPassportProduct}
          onClose={() => setSelectedPassportProduct(null)}
          product={selectedPassportProduct}
        />
      )}

      {/* Supply Cluster Modal */}
      {selectedCluster && (
        <SupplyClusterModal
          isOpen={!!selectedCluster}
          onClose={() => setSelectedCluster(null)}
          cluster={selectedCluster}
        />
      )}
    </div>
  );
};
