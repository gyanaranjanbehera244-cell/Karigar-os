import React, { useState } from 'react';
import {
  Camera,
  Mic,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Users,
  Fingerprint,
  FileText,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../common/LanguageContext';
import { AIImageStudio } from './AIImageStudio';
import { VoiceCataloger } from './VoiceCataloger';
import { CraftFingerprintCard } from './CraftFingerprintCard';
import { PriceIntelligenceCard } from './PriceIntelligenceCard';
import { BuyerMatchingView } from './BuyerMatchingView';
import { SupplyClusterModal } from './SupplyClusterModal';
import { DigitalCraftPassportModal } from './DigitalCraftPassportModal';
import { calculatePriceIntelligence } from '../../utils/pricing';
import { createSupplyCluster } from '../../utils/supplyCluster';
import { Product, LanguageCode, PriceBreakdown, CraftFingerprint } from '../../types';
import { api } from '../../services/api';

interface AddProductWizardProps {
  onProductCreated: (product: Product) => void;
  onCancel: () => void;
}

export const AddProductWizard: React.FC<AddProductWizardProps> = ({
  onProductCreated,
  onCancel,
}) => {
  const { t } = useLanguage();

  // Step 1: Photo & Image Studio
  // Step 2: Voice & Extraction
  // Step 3: Catalog & Fingerprint
  // Step 4: Price Intelligence
  // Step 5: Demand & Buyer Matching
  // Step 6: Publish & Passport
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Wizard state
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  );
  const [imageScore, setImageScore] = useState<number>(94);
  const [transcript, setTranscript] = useState<string>(
    'ମୁଁ ଏହି ସମ୍ବଲପୁରୀ କପା ଶାଢ଼ୀ ହାତରେ ବୁଣିଛି। ଏହାକୁ ବୁଣିବା ପାଇଁ ୪ ଦିନ ଲାଗିଲା। ସୂତା ଏବଂ ରଙ୍ଗ ଖର୍ଚ୍ଚ ପ୍ରାୟ ୯୦୦ ଟଙ୍କା ହୋଇଥିଲା।'
  );
  const [spokenLanguage, setSpokenLanguage] = useState<LanguageCode>('or');

  // Structured Catalog state
  const [catalog, setCatalog] = useState({
    title: 'Handwoven Sambalpuri Cotton Saree (Passapalli & Shankha Motif)',
    category: 'Sarees & Ethnic Wear',
    craft_type: 'Sambalpuri Handloom (Bandhakala)',
    material: '100% Combed Pure Cotton',
    colors: ['Crimson Red', 'Ebony Black', 'Natural Off-White'],
    pattern: 'Traditional Passapalli Geometric Chessboard',
    technique: 'Double Ikat Warp-and-Weft Tie-Dye Weaving',
    origin: 'Bargarh, Western Odisha, India',
    dimensions: '5.5 meters with 0.8m Blouse Piece',
    production_time: '4 days',
    production_days: 4,
    handmade: true,
    material_cost: 900,
    description_en: 'Authentic handwoven Sambalpuri cotton saree handcrafted by master weaver Meena Das in Bargarh, Odisha. Features intricate Bandhakala double ikat tie-dye weaving in iconic crimson red and ebony black with geometric chessboard and conch motifs on the pallu. Breathable, durable, and certified handloom heritage.',
    description_hi: 'ओडिशा के बारगढ़ की मास्टर बुनकर मीना दास द्वारा हथकरघे पर तैयार की गई प्रामाणिक संबलपुरी सूती साड़ी। इसमें पारंपरिक बांधकला डबल इकत टाई-डाई तकनीक से लाल और काले रंगों में शंख और पासापल्ली पैटर्न बनाया गया है। यह पहनने में बेहद आरामदायक, टिकाऊ और हथकरघा विरासत का प्रतीक है।',
    keywords: ['Sambalpuri Saree', 'Odisha Handloom', 'Bandhakala', 'Pure Cotton', 'Passapalli Weave', 'GI Craft'],
    tags: ['Handloom Verified', 'GI Tag Odisha', 'Pure Cotton', 'Eco Dye'],
  });

  const [fingerprint, setFingerprint] = useState<CraftFingerprint>({
    material: '100% Combed Pure Cotton',
    technique: 'Double Ikat Warp-and-Weft Tie-Dye Weaving',
    craft: 'Sambalpuri Handloom (Bandhakala)',
    pattern: 'Traditional Passapalli Geometric Chessboard',
    colors: ['Crimson Red', 'Ebony Black', 'Natural Off-White'],
    region: 'Bargarh, Western Odisha, India',
    productionDays: 4,
    handmade: true,
    consistencyConfidence: 96,
    consistencyStatus: 'consistent',
    consistencyMessage: '✓ Information appears consistent with artisan profile and Sambalpuri Handloom craft benchmarks.',
  });

  const [pricing, setPricing] = useState<PriceBreakdown>(
    calculatePriceIntelligence(900, 4, 'Sambalpuri Handloom', 'Sarees')
  );

  // Modals
  const [showSupplyClusterModal, setShowSupplyClusterModal] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  // Fast Track 1-Click Demo Fill
  const handleFastTrackFill = () => {
    setImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=95');
    setImageScore(94);
    setTranscript('ମୁଁ ଏହି ସମ୍ବଲପୁରୀ କପା ଶାଢ଼ୀ ହାତରେ ବୁଣିଛି। ଏହାକୁ ବୁଣିବା ପାଇଁ ୪ ଦିନ ଲାଗିଲା। ସୂତା ଏବଂ ରଙ୍ଗ ଖର୍ଚ୍ଚ ପ୍ରାୟ ୯୦୦ ଟଙ୍କା ହୋଇଥିଲା।');
    setSpokenLanguage('or');
    setCurrentStep(3); // Jump right into catalog review
  };

  const handleImageApproved = (data: { originalUrl: string; processedUrl: string; score: number }) => {
    setImageUrl(data.processedUrl);
    setImageScore(data.score);
    setCurrentStep(2); // Go to Voice Cataloger
  };

  const handleVoiceExtracted = (result: any) => {
    setTranscript(result.transcript);
    setSpokenLanguage(result.language);
    if (result.catalog) setCatalog(result.catalog);
    if (result.fingerprint) setFingerprint(result.fingerprint);
    const updatedPricing = calculatePriceIntelligence(
      result.catalog?.material_cost || 900,
      result.catalog?.production_days || 4,
      result.catalog?.craft_type,
      result.catalog?.category
    );
    setPricing(updatedPricing);
    setCurrentStep(3); // Go to Catalog & Fingerprint Review
  };

  const handleMaterialCostChange = (newCost: number) => {
    setCatalog((prev) => ({ ...prev, material_cost: newCost }));
    const updated = calculatePriceIntelligence(newCost, catalog.production_days, catalog.craft_type, catalog.category);
    setPricing(updated);
  };

  const handleTriggerBulkCluster = (buyerMatch: any) => {
    const cluster = createSupplyCluster(
      undefined,
      100,
      catalog.title,
      buyerMatch.buyerName,
      buyerMatch.buyerId
    );
    setActiveCluster(cluster);
    setShowSupplyClusterModal(true);
  };

  const handlePublish = async () => {
    const newProd: Product = {
      id: `prod_karigar_${Date.now()}`,
      artisanId: 'artisan_meena_das_01',
      artisanName: 'Meena Das',
      artisanRegion: 'Bargarh, Odisha',
      title: catalog.title,
      category: catalog.category,
      craftType: catalog.craft_type,
      material: catalog.material,
      colors: catalog.colors,
      pattern: catalog.pattern,
      technique: catalog.technique,
      origin: catalog.origin,
      dimensions: catalog.dimensions,
      productionTime: `${catalog.production_days} days`,
      productionDays: catalog.production_days,
      handmade: catalog.handmade,
      materialCost: catalog.material_cost,
      price: pricing.recommendedPrice,
      priceBreakdown: pricing,
      minOrderQuantity: 1,
      availableStock: 6,
      descriptionEn: catalog.description_en,
      descriptionHi: catalog.description_hi,
      originalTranscript: transcript,
      inputLanguage: spokenLanguage,
      keywords: catalog.keywords,
      tags: catalog.tags,
      originalImageUrl: imageUrl,
      processedImageUrl: imageUrl,
      imageReadinessScore: imageScore,
      fingerprint,
      readinessScore: 96,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await api.createProduct(newProd);
    setPublishedProduct(newProd);
    setShowPassportModal(true);
    onProductCreated(newProd);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Wizard Steps Stepper */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold font-serif text-lg border border-amber-600/30">
            {currentStep}
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-100 font-serif">
              {currentStep === 1 && 'Step 1: 📸 Snap / Upload & AI Image Studio'}
              {currentStep === 2 && 'Step 2: 🎙️ Speak Product Details (Voice-First)'}
              {currentStep === 3 && 'Step 3: 🧬 AI Attributes & Craft Fingerprint'}
              {currentStep === 4 && 'Step 4: 💰 Explainable Price Intelligence'}
              {currentStep === 5 && 'Step 5: 🤝 Buyer Matching & AI Supply Cluster'}
            </h2>
            <p className="text-xs text-stone-400">
              Core SIH26090 Flow — Zero tedious typing required.
            </p>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleFastTrackFill}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Auto-Fill Demo</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* STEP 1: AI IMAGE STUDIO */}
      {currentStep === 1 && (
        <AIImageStudio
          initialImage={imageUrl}
          onImageApproved={handleImageApproved}
          onCancel={onCancel}
        />
      )}

      {/* STEP 2: VOICE CATALOGER */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Image Studio</span>
            </button>
          </div>
          <VoiceCataloger onCatalogExtracted={handleVoiceExtracted} />
        </div>
      )}

      {/* STEP 3: STRUCTURED CATALOG & CRAFT FINGERPRINT */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Voice Recording</span>
            </button>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AI Schema Conformance 100%</span>
            </span>
          </div>

          {/* Craft Fingerprint Card */}
          <CraftFingerprintCard fingerprint={fingerprint} />

          {/* Bilingual Catalog Display (English + Hindi) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-serif">
                  Professional Multilingual Catalog
                </h4>
              </div>
              <span className="text-xs text-stone-400">
                Generated from "{spokenLanguage.toUpperCase()}" Voice Input
              </span>
            </div>

            {/* Editable Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-stone-400">
                Product Title (Marketplace Standard)
              </label>
              <input
                type="text"
                value={catalog.title}
                onChange={(e) => setCatalog({ ...catalog, title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 font-semibold focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Bilingual Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>English Description</span>
                  <span className="text-[10px] text-stone-400">Boutique & Retail Ready</span>
                </div>
                <textarea
                  rows={4}
                  value={catalog.description_en}
                  onChange={(e) => setCatalog({ ...catalog, description_en: e.target.value })}
                  className="w-full bg-transparent text-xs text-stone-200 leading-relaxed border-none focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>हिन्दी विवरण (Hindi Description)</span>
                  <span className="text-[10px] text-stone-400">घरेलू बाजार मानक</span>
                </div>
                <textarea
                  rows={4}
                  value={catalog.description_hi}
                  onChange={(e) => setCatalog({ ...catalog, description_hi: e.target.value })}
                  className="w-full bg-transparent text-xs text-stone-200 leading-relaxed border-none focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Tags & Keywords */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] text-stone-400 mr-1">AI Tags:</span>
              {catalog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-800 text-[11px] font-medium text-stone-300 border border-stone-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Step 3 Navigation */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all"
            >
              <span>Calculate Explainable Pricing →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PRICE INTELLIGENCE */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
          </div>

          {/* Interactive Cost Input */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-stone-100">
                Direct Raw Material Cost
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Cotton yarn, vegetable dyes, starch preparation cost in Rupees.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-amber-400">₹</span>
              <input
                type="number"
                value={catalog.material_cost}
                onChange={(e) => handleMaterialCostChange(Number(e.target.value))}
                className="w-32 bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-base font-bold font-mono text-stone-100 focus:border-amber-500 focus:outline-none"
              />
              <span className="text-xs text-stone-400">({catalog.production_days} production days)</span>
            </div>
          </div>

          {/* Price Intelligence Card */}
          <PriceIntelligenceCard pricing={pricing} />

          {/* Step 4 Navigation */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all"
            >
              <span>Find Matching Buyers & Supply Cluster →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: BUYER MATCHING & PUBLISH */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pricing</span>
            </button>
          </div>

          {/* Buyer Matching View */}
          <BuyerMatchingView
            onRequestBulkCluster={handleTriggerBulkCluster}
          />

          {/* Product Publishing Bar */}
          <div className="bg-stone-950 border border-amber-600/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-100">
                  Ready to Publish & Generate Craft Passport
                </h4>
                <p className="text-xs text-stone-400">
                  Verified photo, structured attributes, fair price range ₹{pricing.recommendedPrice}, and buyer match ready.
                </p>
              </div>
            </div>

            <button
              id="publish-product-btn"
              onClick={handlePublish}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Publish & Generate QR Passport</span>
            </button>
          </div>
        </div>
      )}

      {/* Supply Cluster Modal */}
      {showSupplyClusterModal && activeCluster && (
        <SupplyClusterModal
          isOpen={showSupplyClusterModal}
          onClose={() => setShowSupplyClusterModal(false)}
          cluster={activeCluster}
          onConfirmCluster={() => {
            setShowSupplyClusterModal(false);
          }}
        />
      )}

      {/* Digital Craft Passport Modal */}
      {showPassportModal && publishedProduct && (
        <DigitalCraftPassportModal
          isOpen={showPassportModal}
          onClose={() => {
            setShowPassportModal(false);
          }}
          product={publishedProduct}
        />
      )}
    </div>
  );
};
