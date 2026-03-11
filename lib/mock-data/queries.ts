import type { QueueStop, Vehicle, ActivityEntry } from '@/types'
import { getState } from './state'

/** Get all zones sorted by priority score descending */
export function getQueue(): QueueStop[] {
  const { zones } = getState()
  return [...zones].sort((a, b) => b.priority_score - a.priority_score)
}

/** Get a single zone by ID */
export function getZone(zoneId: string): QueueStop | undefined {
  const { zones } = getState()
  return zones.find((z) => z.zone_id === zoneId)
}

/** Get vehicles for a zone (filters out actioned vehicles, returns clean DTOs) */
export function getZoneVehicles(zoneId: string): Vehicle[] {
  const { vehicles } = getState()
  return vehicles
    .filter((v) => v.zone_id === zoneId && !v.actioned)
    .map(({ actioned: _, ...vehicle }) => vehicle)
}

/** Get all activity entries, most recent first */
export function getActivity(): ActivityEntry[] {
  const { activityLog } = getState()
  return [...activityLog]
}
