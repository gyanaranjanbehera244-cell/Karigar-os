import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Users,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  TrendingUp,
  Layers,
  ArrowRight,
  Package,
} from 'lucide-react';
import { Product, BuyerProfile, SupplyCluster } from '../../types';
import { api } from '../../services/api';
import { DigitalCraftPassportModal } from '../artisan/DigitalCraftPassportModal';
import { SupplyClusterModal } from '../artisan/SupplyClusterModal';
import { createSupplyCluster } from '../../utils/supplyCluster';

export const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCraft, setSelectedCraft] = useState<string>('all');
  const [selectedPassportProduct, setSelectedPassportProduct] = useState<Product | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<SupplyCluster | null>(null);

  // Bulk Order Simulation
  const [bulkModalProduct, setBulkModalProduct] = useState<Product | null>(null);
  const [bulkQuantity, setBulkQuantity] = useState<number>(100);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const prods = await api.getProducts();
      setProducts(prods);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.craftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCraft =
      selectedCraft === 'all' || p.craftType.toLowerCase().includes(selectedCraft.toLowerCase());
    return matchesSearch && matchesCraft;
  });

  const handleCreateBulkCluster = (product: Product, quantity: number) => {
    const cluster = createSupplyCluster(
      undefined,
      quantity,
      product.title,
      'Heritage Handloom Boutique',
      'buyer_heritage_boutique_01'
    );
    setSelectedCluster(cluster);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Buyer Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Ethical Sourcing & B2B Wholesale
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Buyer ID: #BUY-HERITAGE-BLR
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-serif">
              Heritage Handloom Boutique (Bangalore)
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl">
              Source directly from verified master weavers across Odisha, Madhya Pradesh, and Kashmir with verified Digital Craft Passports and scalable AI Supply Clusters.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Sourcing Budget</span>
              <span className="text-xl font-bold font-mono text-emerald-400">₹4,50,000</span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Target Crafts</span>
              <span className="text-sm font-semibold text-amber-300">Sambalpuri, Chanderi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by craft, material, weave..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'Sambalpuri', 'Chanderi', 'Pashmina', 'Kantha'].map((craft) => (
            <button
              key={craft}
              onClick={() => setSelectedCraft(craft)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCraft === craft
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {craft === 'all' ? 'All Verified Crafts' : craft}
            </button>
          ))}
        </div>
      </div>

      {/* Products Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-md"
          >
            {/* Image Stage */}
            <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
              <img
                src={product.processedImageUrl || product.originalImageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 border border-stone-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified Handloom</span>
              </div>
              <button
                onClick={() => setSelectedPassportProduct(product)}
                className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>QR Passport</span>
              </button>
            </div>

            {/* Product Meta */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold">{product.craftType}</span>
                  <span className="text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {product.origin || 'Bargarh, Odisha'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-100 font-serif line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {product.descriptionEn}
                </p>
              </div>

              {/* Craft DNA / Attributes */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                <div>
                  <span className="text-stone-500 uppercase font-bold block">Artisan:</span>
                  <span className="font-semibold text-stone-200">{product.artisanName || 'Meena Das'}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase font-bold block">Stock / Mo:</span>
                  <span className="font-mono text-amber-400 font-bold">{product.availableStock || 6} in stock (20/mo)</span>
                </div>
              </div>

              {/* Pricing & Bulk Cluster Request Action */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Wholesale (15+)</span>
                  <span className="text-lg font-bold font-mono text-stone-100">
                    ₹{(product.priceBreakdown?.wholesalePrice || 1900).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleCreateBulkCluster(product, 100)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Request 100-Unit Cluster</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
