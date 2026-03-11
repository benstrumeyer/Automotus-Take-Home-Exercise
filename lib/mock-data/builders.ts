import type { QueueStop, ZoneStatus } from '@/types'
import type { InternalVehicle } from '@/types/domain'
import { computePriorityScore } from '../priority'
import { getCarImageUrl } from '../car-image'
import { ZONE_SEEDS, minutesAgo, computeOverstay } from './seed'

export function buildVehicles(): InternalVehicle[] {
  const result: InternalVehicle[] = []
  for (const zone of ZONE_SEEDS) {
    for (const v of zone.vehicles) {
      const { overstay_minutes, overstay_status } = computeOverstay(v.arrivalMinutesAgo, v.timeLimitMinutes)
      result.push({
        id: `veh-${v.plate.toLowerCase().replace(/-/g, '')}`,
        zone_id: zone.id,
        license_plate: v.plate,
        type: v.type,
        make: v.make,
        model: v.model,
        color: v.color,
        arrival_time: minutesAgo(v.arrivalMinutesAgo),
        time_limit_minutes: v.timeLimitMinutes,
        overstay_minutes,
        overstay_status,
        image_url: getCarImageUrl(v.make, v.model, v.color),
      })
    }
  }
  return result
}

export function buildZones(vehicleList: InternalVehicle[]): QueueStop[] {
  return ZONE_SEEDS.map((zone) => {
    const zoneVehicles = vehicleList.filter((v) => v.zone_id === zone.id)
    const violationCount = zoneVehicles.filter((v) => v.overstay_status === 'violation').length
    const approachingCount = zoneVehicles.filter((v) => v.overstay_status === 'approaching').length
    const occupancy = zoneVehicles.length
    const score = computePriorityScore(violationCount, violationCount, occupancy, zone.maxCapacity)
    return {
      id: zone.id,
      zone_id: zone.id,
      zone_name: zone.name,
      address: zone.address,
      lat: zone.lat,
      lng: zone.lng,
      priority_score: Math.round(score * 100) / 100,
      vehicle_count: occupancy,
      violation_count: violationCount,
      approaching_count: approachingCount,
      occupancy,
      max_capacity: zone.maxCapacity,
      status: 'idle' as ZoneStatus,
      vehicle_thumbnails: zoneVehicles
        .filter((v) => v.overstay_status === 'violation')
        .map((v) => v.image_url)
        .filter(Boolean),
    }
  })
}
