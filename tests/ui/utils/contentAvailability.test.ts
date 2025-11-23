import { describe, expect, it } from 'vitest';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { isAvailableInCampaign } from '@/ui/utils/contentAvailability';

describe('content availability helpers', () => {
  it('filters tower-only equipment from campaign listings', () => {
    const campaignIds = Object.values(EQUIPMENT)
      .filter(isAvailableInCampaign)
      .map((item) => item.id);

    expect(campaignIds).toContain('bronze-sword');
    expect(campaignIds).not.toContain('eclipse-blade');
  });
});

