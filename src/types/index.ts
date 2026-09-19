export type UserRole = 'artisan' | 'buyer' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'or'; // English, Hindi, Odia

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: LanguageCode;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtisanProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  craftType: string;
  craft?: string;
  region: string;
  village?: string;
  district?: string;
  state?: string;
  location: string;
  avatarUrl?: string;
  experienceYears: number;
  specialization: string;
  averageProductionDays: number;
  monthlyCapacity: number;
  monthlyCapacityUnits?: number;
  typicalPriceRange: any;
  currentDemandLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  craftStory?: string;
  craftStoryEn?: string;
  craftStoryHi?: string;
  verificationStatus: 'verified_profile' | 'community_acknowledged' | 'pending';
  totalProductsCount: number;
  activeBuyerLeads: number;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  businessName: string;
  buyerType: 'Boutique' | 'Wholesaler' | 'Retail Brand' | 'Export House' | 'Corporate Gifting';
  location: string;
  preferredCrafts: string[];
  preferredMaterials: string[];
  targetPriceRange: { min: number; max: number };
  minOrderQuantity: number;
  verifiedStatus: boolean;
}

export interface StructuredProductCatalog {
  title: string;
  category: string;
  craft_type: string;
  material: string;
  colors: string[];
  pattern: string;
  technique: string;
  origin: string;
  dimensions: string;
  production_time: string;
  handmade: boolean;
  material_cost: number;
  description_en: string;
  description_hi: string;
  keywords: string[];
  tags: string[];
}

export interface CraftFingerprint {
  material: string;
  technique: string;
  craft: string;
  pattern: string;
  colors: string[];
  region: string;
  productionDays: number;
  handmade: boolean;
  consistencyConfidence: number; // 0-100%
  consistencyStatus: 'consistent' | 'warning' | 'needs_verification';
  consistencyMessage: string;
  embeddingVector?: number[];
}

export interface PriceBreakdown {
  materialCost: number;
  estimatedLabour: number;
  packagingCost: number;
  fairMargin: number;
  craftPremium: number;
  marketMin: number;
  marketMax: number;
  sustainableFloor: number;
  recommendedPrice: number;
  wholesalePrice: number;
  recommendedRange: { min: number; max: number };
  confidence: 'Low' | 'Medium' | 'High';
  explanation: string;
  costItems: { label: string; amount: number; description: string }[];
}

export interface Product {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanRegion: string;
  title: string;
  category: string;
  craftType: string;
  material: string;
  colors: string[];
  pattern: string;
  technique: string;
  origin: string;
  dimensions: string;
  productionTime: string;
  productionDays: number;
  handmade: boolean;
  materialCost: number;
  price: number;
  priceBreakdown: PriceBreakdown;
  minOrderQuantity: number;
  availableStock: number;
  descriptionEn: string;
  descriptionHi: string;
  originalTranscript?: string;
  inputLanguage?: LanguageCode;
  keywords: string[];
  tags: string[];
  originalImageUrl: string;
  processedImageUrl: string;
  imageReadinessScore: number;
  fingerprint: CraftFingerprint;
  readinessScore: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface MarketProduct {
  id: string;
  title: string;
  category: string;
  craftType: string;
  material: string;
  region: string;
  price: number;
  imageUrl: string;
  benchmarkSource: string;
  date: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  location: string;
  category: string;
  craftType: string;
  material: string;
  minPrice: number;
  maxPrice: number;
  minimumQuantity: number;
  maxQuantity: number;
}

export interface BuyerMatchResult {
  buyerId: string;
  buyerName: string;
  buyerType: string;
  location: string;
  overallScore: number; // 0-100
  scoreBreakdown: {
    categorySimilarity: number; // weight 30%
    craftSimilarity: number;     // weight 25%
    materialSimilarity: number;  // weight 15%
    priceCompatibility: number;  // weight 15%
    moqCompatibility: number;    // weight 10%
    regionPreference: number;    // weight 5%
  };
  matchedReasons: string[];
  buyerMinOrder: number;
  buyerTargetPrice: string;
}

export interface SupplyClusterMember {
  artisanId: string;
  artisanName: string;
  location: string;
  region: string;
  craftType: string;
  availableCapacity: number;
  allocatedUnits: number;
  estimatedDays: number;
  unitPrice: number;
  qualityRating: number;
  fingerprintMatch: number;
}

export interface SupplyCluster {
  id: string;
  buyerId: string;
  buyerName: string;
  productTitle: string;
  craftType: string;
  requestedQuantity: number;
  matchedQuantity: number;
  combinedCapacity: number;
  estimatedFulfillmentDays: number;
  estimatedPriceRange: { min: number; max: number };
  clusterMembers: SupplyClusterMember[];
  status: 'recommended' | 'confirmed' | 'in_production';
  createdAt: string;
}

export interface DemandSignal {
  id: string;
  craftType: string;
  category: string;
  material: string;
  trend: 'HIGH' | 'RISING' | 'STABLE' | 'MODERATE';
  trendDirection: 'up' | 'stable' | 'down';
  growthPercentage: number;
  popularColorPalette: string[];
  suggestedPriceRange: { min: number; max: number };
  sampleBuyerInterestCount: number;
  aiRecommendation: string;
}

export interface BuyerLead {
  id: string;
  productId?: string;
  productTitle?: string;
  buyerId?: string;
  buyerName?: string;
  buyerType?: string;
  buyerLocation?: string;
  quantity?: number;
  requestedQuantity?: number;
  offeredPrice?: number;
  artisanFloorPrice?: number;
  recommendedPrice?: number;
  negotiationNote?: string;
  status?: 'new' | 'negotiating' | 'accepted' | 'declined';
  aiNegotiationAdvice?: {
    marginAssessment: 'Low' | 'Healthy' | 'Premium';
    suggestedCounterOffer: number;
    explanation: string;
    talkingPoints: string[];
  };
  createdAt?: string;
}

export type Lead = BuyerLead;

export interface AIProcessingLog {
  id: string;
  operation: 'image_enhancement' | 'speech_transcription' | 'attribute_extraction' | 'pricing_model' | 'buyer_matching' | 'supply_cluster';
  model: string;
  status: 'success' | 'fallback';
  latencyMs: number;
  timestamp: string;
}
