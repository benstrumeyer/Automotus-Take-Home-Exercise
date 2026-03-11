/** Zone lifecycle status as an officer interacts with it */
export type ZoneStatus = 'idle' | 'on_scene'

/** Vehicle classification */
export type VehicleType = 'personal' | 'rideshare' | 'delivery' | 'commercial'

/** How close a vehicle is to exceeding its time limit */
export type OverstayStatus = 'ok' | 'approaching' | 'violation'

/** Vehicle enforcement actions */
export type EnforcementAction = 'cite' | 'warn' | 'skip'

/** Zone lifecycle actions */
export type ZoneAction = 'arrive' | 'depart'

/** All actions an officer can take (enforcement + zone + legacy) */
export type ActionType = EnforcementAction | ZoneAction | 'clear'

/** Priority level derived from priority_score thresholds */
export type PriorityLevel = 'high' | 'medium' | 'clear'

/** A zone in the officer's queue, sorted by priority */
export interface QueueStop {
  id: string
  zone_id: string
  zone_name: string
  address: string
  lat: number
  lng: number
  priority_score: number
  priority_level: PriorityLevel
  vehicle_count: number
  overstay_count: number
  violation_count: number
  approaching_count: number
  occupancy: number
  max_capacity: number
  status: ZoneStatus
  vehicle_thumbnails: string[]
}

/** A vehicle parked in a zone */
export interface Vehicle {
  id: string
  zone_id: string
  license_plate: string
  type: VehicleType
  make: string
  model: string
  color: string
  arrival_time: string
  time_limit_minutes: number
  overstay_minutes: number
  overstay_status: OverstayStatus
  spot_label: string
  image_url: string
  actioned?: ActionType
}

/** A single entry in the officer's activity log */
export interface ActivityEntry {
  id: string
  zone_id: string
  zone_name: string
  vehicle_id?: string
  license_plate?: string
  vehicle_image?: string
  action: ActionType
  note?: string
  timestamp: string
}

/** Zone detail response including vehicles */
export interface ZoneDetail {
  zone: QueueStop
  vehicles: Vehicle[]
}
