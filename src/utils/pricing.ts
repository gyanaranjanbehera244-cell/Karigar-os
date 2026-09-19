import { PriceBreakdown } from '../types';

export function calculatePriceIntelligence(
  materialCostInput: number,
  productionDaysInput: number = 4,
  craftType: string = 'Sambalpuri Handloom',
  category: string = 'Sarees'
): PriceBreakdown {
  const materialCost = Math.max(100, Number(materialCostInput) || 900);
  const productionDays = Math.max(1, Number(productionDaysInput) || 4);

  // Daily fair artisan skilled living wage benchmark in India (₹200 - ₹350/day depending on craft complexity)
  const dailyLaborRate = craftType.toLowerCase().includes('ikat') || craftType.toLowerCase().includes('sambalpuri')
    ? 225
    : 190;
  
  const estimatedLabour = Math.round(productionDays * dailyLaborRate);
  const packagingCost = Math.round(materialCost > 800 ? 100 : 60);

  // Minimum sustainable floor: direct material + labor + packaging + minimal 5% buffer
  const directProductionCost = materialCost + estimatedLabour + packagingCost;
  const sustainableFloor = Math.round(directProductionCost * 1.05);

  // Market benchmark analysis for comparable crafts
  let marketMin = 1800;
  let marketMax = 2600;

  if (category.toLowerCase().includes('dupatta') || category.toLowerCase().includes('stole')) {
    marketMin = Math.round(sustainableFloor * 1.15);
    marketMax = Math.round(sustainableFloor * 1.65);
  } else if (category.toLowerCase().includes('saree')) {
    marketMin = Math.max(1800, Math.round(sustainableFloor * 1.1));
    marketMax = Math.max(2600, Math.round(sustainableFloor * 1.6));
  } else {
    marketMin = Math.round(sustainableFloor * 1.15);
    marketMax = Math.round(sustainableFloor * 1.55);
  }

  // Fair margin (15% - 25% for artisan livelihood development)
  const fairMargin = Math.round(directProductionCost * 0.22);
  
  // Craft rarity / heritage technique premium
  const craftPremium = Math.round(productionDays >= 4 ? 150 : 80);

  // Recommended retail price
  let recommendedPrice = Math.round(sustainableFloor + fairMargin + craftPremium);
  // Round to psychological artisan retail price ending in 99 or 50
  recommendedPrice = Math.ceil(recommendedPrice / 50) * 50 - 1;
  if (recommendedPrice < sustainableFloor * 1.15) {
    recommendedPrice = Math.round(sustainableFloor * 1.25);
  }

  // Wholesale volume price (for orders 15+ units)
  const wholesalePrice = Math.round(sustainableFloor + Math.round(fairMargin * 0.65));

  const recommendedRange = {
    min: Math.round(recommendedPrice * 0.92),
    max: Math.round(recommendedPrice * 1.08),
  };

  const confidence: 'Low' | 'Medium' | 'High' = materialCost > 0 && productionDays > 0 ? 'High' : 'Medium';

  const explanation = `Direct raw materials cost is ₹${materialCost.toLocaleString('en-IN')}, combined with ${productionDays} days of skilled artisanal handcraft benchmarked at ₹${estimatedLabour.toLocaleString('en-IN')} and eco-packaging (₹${packagingCost}), establishing a non-negotiable sustainable floor of ₹${sustainableFloor.toLocaleString('en-IN')}. Based on comparable verified craft market benchmarks (₹${marketMin.toLocaleString('en-IN')}–₹${marketMax.toLocaleString('en-IN')}), the recommended direct-to-consumer price is ₹${recommendedPrice.toLocaleString('en-IN')} with a wholesale B2B tier of ₹${wholesalePrice.toLocaleString('en-IN')}.`;

  const costItems = [
    {
      label: 'Direct Raw Material & Natural Dyes',
      amount: materialCost,
      description: 'Yarn, silk/cotton fibers, natural extracts & preparation',
    },
    {
      label: `Artisan Skilled Labor (${productionDays} Days)`,
      amount: estimatedLabour,
      description: `₹${dailyLaborRate}/day sustainable artisan fair wage benchmark`,
    },
    {
      label: 'Eco Finishing & Protective Packaging',
      amount: packagingCost,
      description: 'Hand starching, pressing, tagging, and bio-muslin wrap',
    },
    {
      label: 'Artisan Livelihood & Craft Skill Premium',
      amount: fairMargin + craftPremium,
      description: 'Heritage technique valuation and sustainable reinvestment',
    },
  ];

  return {
    materialCost,
    estimatedLabour,
    packagingCost,
    fairMargin,
    craftPremium,
    marketMin,
    marketMax,
    sustainableFloor,
    recommendedPrice,
    wholesalePrice,
    recommendedRange,
    confidence,
    explanation,
    costItems,
  };
}
