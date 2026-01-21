
/**
 * QWT Finance Engine v3.0 - Institutional Grade
 * Architect: Ilyas Tahir
 * Logic: Academy-Fixed Pricing Tiers (Director Controlled)
 */

export const ACADEMY_COMMISSION_RATE = 0.60; 
export const TUTOR_SHARE_RATE = 0.40;        

// Academy-Fixed Rates (The Director sets these, not the tutors)
export const PRICE_TIERS = {
  STANDARD: 65, // Standard Vetted Tutor
  SENIOR: 85,   // Ijazah Master / Senior Scholar
  ELITE: 110    // Specialized Hifz/Tafseer Dean
};

export const OPS_BREAKDOWN = {
  INFRASTRUCTURE: 0.15, 
  SECURITY: 0.15,       
  ADMINISTRATION: 0.20, 
  MARKETING: 0.10,      
};

export interface CalculationResult {
  gross: number;
  discount: number;
  net: number;
  academyFee: number;
  tutorEarning: number;
  tier: string;
  opsBreakdown: {
    infrastructure: number;
    security: number;
    admin: number;
    marketing: number;
  };
}

export const calculateEnrollmentFinances = (
  tierName: keyof typeof PRICE_TIERS = 'STANDARD',
  studentCount: number = 1,
  rate: number = 1 // Currency conversion rate
): CalculationResult => {
  const basePrice = PRICE_TIERS[tierName];
  const baseInCents = Math.round(basePrice * rate * 100);
  const totalGrossCents = baseInCents * studentCount;
  
  // Institutional Family Discount
  let discountPercent = 0;
  if (studentCount === 2) discountPercent = 0.10;
  else if (studentCount >= 3) discountPercent = 0.20;
  
  const discountCents = Math.round(totalGrossCents * discountPercent);
  const netCents = totalGrossCents - discountCents;
  
  const academyFeeCents = Math.round(netCents * ACADEMY_COMMISSION_RATE);
  const tutorEarningCents = netCents - academyFeeCents;

  return {
    gross: totalGrossCents / 100,
    discount: discountCents / 100,
    net: netCents / 100,
    academyFee: academyFeeCents / 100,
    tutorEarning: tutorEarningCents / 100,
    tier: tierName,
    opsBreakdown: {
      infrastructure: Math.round(netCents * OPS_BREAKDOWN.INFRASTRUCTURE) / 100,
      security: Math.round(netCents * OPS_BREAKDOWN.SECURITY) / 100,
      admin: Math.round(netCents * OPS_BREAKDOWN.ADMINISTRATION) / 100,
      marketing: Math.round(netCents * OPS_BREAKDOWN.MARKETING) / 100,
    }
  };
};
