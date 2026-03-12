'use client'

import { useState, useCallback } from 'react'
import { ErrorState } from '@/components/error-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ZoneDetailDrawer } from '@/components/zone/zone-detail-drawer'
import { useQueue } from '@/hooks/use-queue'
import { useOfficerLocation } from '@/hooks/use-officer-location'
import dynamic from 'next/dynamic'
import type { QueueStop } from '@/types'

const MapView = dynamic(() => import('@/components/map/map-view').then(m => m.MapView), {
  ssr: false,
})
import styles from './page.module.scss'

export default function MapPage() {
  const { data: queue, isLoading, isError, refetch } = useQueue()
  const { location: officerLocation } = useOfficerLocation()
  const [selectedZone, setSelectedZone] = useState<QueueStop | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMarkerTap = useCallback((stop: QueueStop) => {
    setSelectedZone(stop)
    setDrawerOpen(true)
  }, [])

  return (
    <>
      <main id="main-content" className={styles.main}>
        {isLoading ? <LoadingSpinner label="Loading map…" /> : null}

        {isError ? (
          <ErrorState
            message="Couldn't load zone data for the map."
            onRetry={() => refetch()}
          />
        ) : null}

        {queue && queue.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles['empty-text']}>No zones to display on the map.</p>
          </div>
        ) : null}

        {queue && queue.length > 0 ? (
          <MapView zones={queue} onMarkerTap={handleMarkerTap} officerLocation={officerLocation} />
        ) : null}
      </main>

      <ZoneDetailDrawer
        selectedZone={selectedZone}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  )
}
