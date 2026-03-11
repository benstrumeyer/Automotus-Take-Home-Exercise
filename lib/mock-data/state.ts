import type { MockState } from '@/types/domain'
import { buildVehicles, buildZones } from './builders'

const GLOBAL_KEY = '__parkpatrol_mock_state__' as const

function createFreshState(): MockState {
  const vehicles = buildVehicles()
  return {
    vehicles,
    zones: buildZones(vehicles),
    activityLog: [],
  }
}

/** Returns the singleton mock state, creating it on first access */
export function getState(): MockState {
  const g = globalThis as unknown as Record<string, MockState | undefined>
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = createFreshState()
  }
  return g[GLOBAL_KEY]!
}

/** Reset state to initial seed data (useful for testing) */
export function resetState(): void {
  const g = globalThis as unknown as Record<string, MockState | undefined>
  g[GLOBAL_KEY] = createFreshState()
}
