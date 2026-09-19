import { ArtisanProfile, SupplyCluster, SupplyClusterMember } from '../types';
import { DEMO_ARTISAN, DEMO_PEER_ARTISANS } from '../data/demoData';

export function createSupplyCluster(
  leadArtisan: ArtisanProfile = DEMO_ARTISAN,
  requestedQuantity: number = 100,
  productTitle: string = 'Handwoven Sambalpuri Cotton Saree',
  buyerName: string = 'Virasat Artisan Alliance (Corporate Sourcing)',
  buyerId: string = 'buyer_tata_trusts_05'
): SupplyCluster {
  // Combine lead artisan + verified peer artisans in the same craft cluster
  const clusterPeers = [leadArtisan, ...DEMO_PEER_ARTISANS];

  let remainingUnits = requestedQuantity;
  const clusterMembers: SupplyClusterMember[] = [];

  // Allocations proportional to capacity
  const targetCapacities: { [key: string]: number } = {
    [leadArtisan.id]: Math.min(20, leadArtisan.monthlyCapacity),
    'artisan_ramesh_meher_02': 25,
    'artisan_binodini_patra_03': 20,
    'artisan_subash_sahoo_04': 35,
  };

  let totalAllocated = 0;

  for (const artisan of clusterPeers) {
    if (remainingUnits <= 0) break;
    const maxAlloc = targetCapacities[artisan.id] || 20;
    const allocated = Math.min(remainingUnits, maxAlloc);

    clusterMembers.push({
      artisanId: artisan.id,
      artisanName: artisan.name,
      location: artisan.location,
      region: artisan.region,
      craftType: artisan.craftType,
      availableCapacity: artisan.monthlyCapacity,
      allocatedUnits: allocated,
      estimatedDays: Math.ceil((allocated * artisan.averageProductionDays) / 1.5),
      unitPrice: 1880,
      qualityRating: 95 + Math.floor(Math.random() * 4),
      fingerprintMatch: artisan.id === leadArtisan.id ? 100 : 96,
    });

    remainingUnits -= allocated;
    totalAllocated += allocated;
  }

  // Calculate combined metrics
  const combinedCapacity = clusterMembers.reduce((sum, m) => sum + m.availableCapacity, 0);
  const maxDays = Math.max(...clusterMembers.map(m => m.estimatedDays), 24);

  return {
    id: `cluster_${Date.now()}`,
    buyerId,
    buyerName,
    productTitle,
    craftType: leadArtisan.craftType,
    requestedQuantity,
    matchedQuantity: totalAllocated,
    combinedCapacity,
    estimatedFulfillmentDays: maxDays,
    estimatedPriceRange: { min: 1850, max: 1950 },
    clusterMembers,
    status: 'recommended',
    createdAt: new Date().toISOString(),
  };
}
