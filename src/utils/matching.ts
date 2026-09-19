import { Product, BuyerProfile, BuyerMatchResult } from '../types';

export function calculateBuyerMatchScore(
  product: Product,
  buyer: BuyerProfile
): BuyerMatchResult {
  const matchedReasons: string[] = [];

  // 1. Category Similarity (Weight: 30%)
  let categoryScore = 0;
  const prodCat = (product.category || '').toLowerCase();
  const prodTitle = (product.title || '').toLowerCase();
  const hasCatMatch = buyer.preferredCrafts.some(c => 
    c.toLowerCase().includes('saree') || prodCat.includes('saree') || prodTitle.includes('saree')
  );
  if (hasCatMatch || prodCat.includes('ethnic') || prodCat.includes('textile') || prodCat.includes('saree')) {
    categoryScore = 100;
    matchedReasons.push('✓ Category match (Textiles & Sarees)');
  } else {
    categoryScore = 60;
    matchedReasons.push('~ Related craft category');
  }

  // 2. Craft Similarity (Weight: 25%)
  let craftScore = 0;
  const prodCraft = (product.craftType || '').toLowerCase();
  const hasCraftExact = buyer.preferredCrafts.some(c => prodCraft.includes(c.toLowerCase()) || c.toLowerCase().includes(prodCraft));
  if (hasCraftExact) {
    craftScore = 100;
    matchedReasons.push(`✓ Exact craft match (${product.craftType})`);
  } else if (prodCraft.includes('handloom') || prodCraft.includes('ikat')) {
    craftScore = 80;
    matchedReasons.push('✓ Handloom & Ikat cluster alignment');
  } else {
    craftScore = 40;
  }

  // 3. Material Similarity (Weight: 15%)
  let materialScore = 0;
  const prodMat = (product.material || '').toLowerCase();
  const hasMatMatch = buyer.preferredMaterials.some(m => prodMat.includes(m.toLowerCase()) || m.toLowerCase().includes('cotton'));
  if (hasMatMatch) {
    materialScore = 100;
    matchedReasons.push(`✓ Material compatibility (${product.material})`);
  } else {
    materialScore = 50;
  }

  // 4. Price Compatibility (Weight: 15%)
  let priceScore = 0;
  const prodPrice = product.price || 2199;
  const { min: targetMin, max: targetMax } = buyer.targetPriceRange;
  if (prodPrice >= targetMin && prodPrice <= targetMax) {
    priceScore = 100;
    matchedReasons.push(`✓ Price within target bracket (₹${targetMin}–₹${targetMax})`);
  } else if (prodPrice < targetMin) {
    priceScore = 90; // Cheaper than target is very attractive to buyer
    matchedReasons.push('✓ Highly competitive wholesale pricing');
  } else if (prodPrice <= targetMax * 1.15) {
    priceScore = 70;
    matchedReasons.push('~ Close to upper price budget threshold');
  } else {
    priceScore = 30;
  }

  // 5. MOQ Compatibility (Weight: 10%)
  let moqScore = 0;
  const prodMoq = product.minOrderQuantity || 1;
  if (prodMoq <= buyer.minOrderQuantity) {
    moqScore = 100;
    matchedReasons.push(`✓ MOQ compatible (Min order: ${buyer.minOrderQuantity} units)`);
  } else if (prodMoq <= buyer.minOrderQuantity * 1.5) {
    moqScore = 75;
  } else {
    moqScore = 40;
  }

  // 6. Region Preference (Weight: 5%)
  let regionScore = 0;
  const prodRegion = (product.artisanRegion || product.origin || '').toLowerCase();
  if (prodRegion.includes('odisha') || prodRegion.includes('bargarh') || prodRegion.includes('india')) {
    regionScore = 100;
    matchedReasons.push('✓ Authentic geographic origin verification (Odisha GI cluster)');
  } else {
    regionScore = 70;
  }

  // Weighted total: 0.30*Cat + 0.25*Craft + 0.15*Mat + 0.15*Price + 0.10*MOQ + 0.05*Region
  const overallScore = Math.round(
    (categoryScore * 0.30) +
    (craftScore * 0.25) +
    (materialScore * 0.15) +
    (priceScore * 0.15) +
    (moqScore * 0.10) +
    (regionScore * 0.05)
  );

  return {
    buyerId: buyer.id,
    buyerName: buyer.businessName,
    buyerType: buyer.buyerType,
    location: buyer.location,
    overallScore: Math.min(100, Math.max(0, overallScore)),
    scoreBreakdown: {
      categorySimilarity: categoryScore,
      craftSimilarity: craftScore,
      materialSimilarity: materialScore,
      priceCompatibility: priceScore,
      moqCompatibility: moqScore,
      regionPreference: regionScore,
    },
    matchedReasons,
    buyerMinOrder: buyer.minOrderQuantity,
    buyerTargetPrice: `₹${buyer.targetPriceRange.min.toLocaleString('en-IN')}–₹${buyer.targetPriceRange.max.toLocaleString('en-IN')}`,
  };
}

export function rankBuyersForProduct(
  product: Product,
  buyers: BuyerProfile[]
): BuyerMatchResult[] {
  return buyers
    .map(buyer => calculateBuyerMatchScore(product, buyer))
    .sort((a, b) => b.overallScore - a.overallScore);
}
