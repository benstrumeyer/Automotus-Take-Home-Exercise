/**
 * Computes a priority score for a zone based on enforcement urgency.
 *
 * Weights:
 * - overstay_count * 3  (most urgent — vehicles already past limit)
 * - violation_count * 2  (active violations needing attention)
 * - occupancy_pct        (higher occupancy = more likely new violations)
 *
 * @returns A numeric score where higher = more urgent
 */
export function computePriorityScore(
  overstayCount: number,
  violationCount: number,
  occupancy: number,
  maxCapacity: number
): number {
  const occupancyPct = maxCapacity > 0 ? (occupancy / maxCapacity) * 100 : 0
  return overstayCount * 3 + violationCount * 2 + occupancyPct / 100
}
