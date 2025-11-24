type AvailabilityTarget = 'campaign' | 'tower';

interface AvailabilityLike {
  availableIn?: ReadonlyArray<AvailabilityTarget>;
}

function normalizeAvailability(entry: AvailabilityLike): ReadonlyArray<AvailabilityTarget> {
  return entry.availableIn && entry.availableIn.length > 0 ? entry.availableIn : (['campaign'] as const);
}

export function isAvailableInCampaign(entry: AvailabilityLike): boolean {
  return normalizeAvailability(entry).includes('campaign');
}

export function isAvailableInTower(entry: AvailabilityLike): boolean {
  return normalizeAvailability(entry).includes('tower');
}

export function filterByAvailability<T extends AvailabilityLike>(items: readonly T[], target: AvailabilityTarget): T[] {
  if (target === 'campaign') {
    return items.filter(isAvailableInCampaign);
  }
  return items.filter(isAvailableInTower);
}

