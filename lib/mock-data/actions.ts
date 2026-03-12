import type { QueueStop, Vehicle, ActivityEntry } from '@/types'
import { computePriorityScore } from '../priority'
import { generateId } from '../utils'
import { getState } from './state'

const now = () => new Date().toISOString()

/** Claim a zone (On My Way) — sets status to on_scene, logs activity as depart */
export function arriveAtZone(zoneId: string): { zone: QueueStop; activity: ActivityEntry } | undefined {
  const { zones, activityLog } = getState()
  const zone = zones.find((z) => z.zone_id === zoneId)
  if (!zone) return undefined
  zone.status = 'on_scene'
  const entry: ActivityEntry = {
    id: generateId(),
    zone_id: zoneId,
    zone_name: zone.zone_name,
    action: 'depart',
    timestamp: now(),
  }
  activityLog.unshift(entry)
  return { zone, activity: entry }
}

/** Depart from a zone — sets status back to idle, logs activity */
export function departZone(zoneId: string): { zone: QueueStop; activity: ActivityEntry } | undefined {
  const { zones, activityLog } = getState()
  const zone = zones.find((z) => z.zone_id === zoneId)
  if (!zone) return undefined
  zone.status = 'idle'
  const entry: ActivityEntry = {
    id: generateId(),
    zone_id: zoneId,
    zone_name: zone.zone_name,
    action: 'depart',
    timestamp: now(),
  }
  activityLog.unshift(entry)
  return { zone, activity: entry }
}

/** Take enforcement action on a vehicle — marks vehicle, recalculates zone, logs activity */
export function enforceVehicle(
  zoneId: string,
  vehicleId: string,
  action: 'cite' | 'warn' | 'skip',
): { zone: QueueStop; vehicle: Vehicle; activity: ActivityEntry } | undefined {
  const { zones, vehicles, activityLog } = getState()
  const zone = zones.find((z) => z.zone_id === zoneId)
  if (!zone) return undefined
  const vehicle = vehicles.find((v) => v.id === vehicleId && v.zone_id === zoneId)
  if (!vehicle) return undefined

  vehicle.actioned = action

  // Recompute zone stats
  const zoneVehicles = vehicles.filter((v) => v.zone_id === zoneId && !v.actioned)
  zone.vehicle_count = zoneVehicles.length
  zone.violation_count = zoneVehicles.filter((v) => v.overstay_status === 'violation').length
  zone.approaching_count = zoneVehicles.filter((v) => v.overstay_status === 'approaching').length
  zone.occupancy = zoneVehicles.length
  zone.priority_score = Math.round(
    computePriorityScore(zone.violation_count, zone.violation_count, zone.occupancy, zone.max_capacity) * 100
  ) / 100
  zone.vehicle_thumbnails = zoneVehicles
    .filter((v) => v.overstay_status === 'violation')
    .map((v) => v.image_url)
    .filter(Boolean)

  const entry: ActivityEntry = {
    id: generateId(),
    zone_id: zoneId,
    zone_name: zone.zone_name,
    action,
    timestamp: now(),
  }
  activityLog.unshift(entry)

  const { actioned: _, ...publicVehicle } = vehicle
  return { zone, vehicle: publicVehicle, activity: entry }
}
