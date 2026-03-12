'use client'

import { useCallback } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { VehicleCard } from './vehicle-card'
import { ErrorState } from '@/components/error-state'
import { useZoneDetail } from '@/hooks/use-zone-detail'
import { useDepartZone, useEnforceVehicle } from '@/hooks/use-zone-actions'
import { useOfficerLocation } from '@/hooks/use-officer-location'
import type { QueueStop, EnforcementAction } from '@/types'
import { Navigation, MapPin, AlertTriangle, Car } from 'lucide-react'
import styles from './zone-detail-drawer.module.scss'

interface ZoneDetailDrawerProps {
  selectedZone: QueueStop | null
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function ZoneDetailDrawer({ selectedZone, open, onOpenChange }: ZoneDetailDrawerProps) {
  const { data, isLoading, isError, refetch } = useZoneDetail(
    open ? selectedZone?.zone_id ?? null : null
  )
  const depart = useDepartZone()
  const enforce = useEnforceVehicle()
  const { location: officerLocation } = useOfficerLocation()

  // Prefer fresh zone data from detail query (includes optimistic updates)
  const zone = data?.zone ?? selectedZone
  const isOnMyWay = zone?.status === 'on_scene'

  const handleOnMyWay = useCallback(() => {
    if (!zone) return
    depart.mutate(zone.zone_id)
  }, [zone, depart])

  const handleVehicleAction = useCallback((vehicleId: string, action: EnforcementAction) => {
    if (!zone) return
    enforce.mutate({
      zoneId: zone.zone_id,
      vehicleId,
      action,
    })
  }, [zone, enforce])

  const handleNavigate = useCallback(() => {
    if (!zone) return
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${officerLocation.lat},${officerLocation.lng}&destination=${zone.lat},${zone.lng}&travelmode=walking`,
      '_blank'
    )
  }, [zone, officerLocation])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={styles.content}>
        <div className={styles.wrapper}>
          <DrawerHeader className={styles.header}>
            <div className={styles.titleRow}>
              <DrawerTitle className={styles.title}>
                {zone?.zone_name ?? 'Zone Detail'}
              </DrawerTitle>
              {zone && zone.violation_count > 0 && (
                <span className={styles.violationPill}>
                  <AlertTriangle size={12} aria-hidden="true" />
                  {zone.violation_count}
                </span>
              )}
            </div>

            <DrawerDescription className={styles.description}>
              <MapPin size={11} className={styles.descIcon} aria-hidden="true" />
              {zone?.address}
              {zone && (
                <span className={styles.occupancyPill}>
                  <Car size={12} aria-hidden="true" />
                  {zone.occupancy}/{zone.max_capacity}
                </span>
              )}
            </DrawerDescription>

            {zone && (
              <div className={styles.actionRow}>
                <Button
                  variant="secondary"
                  className={styles.statusBtn}
                  onClick={handleOnMyWay}
                  disabled={isOnMyWay || depart.isPending}
                >
                  On My Way
                </Button>
                <Button
                  size="icon"
                  className={styles.navBtn}
                  onClick={handleNavigate}
                  aria-label="Navigate to zone"
                >
                  <Navigation size={18} aria-hidden="true" />
                </Button>
              </div>
            )}
          </DrawerHeader>

          <div className={styles.divider} />

          <div className={styles.vehicles}>
            {isLoading && <LoadingSpinner label="Loading vehicles…" />}

            {isError && (
              <ErrorState
                message="Couldn't load vehicles for this zone."
                onRetry={() => refetch()}
              />
            )}

            {data && data.vehicles.length === 0 && (
              <div className={styles.empty}>No vehicles in this zone right now.</div>
            )}

            {data?.vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onAction={handleVehicleAction}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
