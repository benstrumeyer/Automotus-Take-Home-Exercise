'use client'

import Image from 'next/image'
import type { QueueStop } from '@/types'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import styles from './queue-card.module.scss'

interface QueueCardProps {
  stop: QueueStop
  onTap: (stop: QueueStop) => void
}

export function QueueCard({ stop, onTap }: QueueCardProps) {
  return (
    <button
      className={styles.card}
      onClick={() => onTap(stop)}
      type="button"
    >
      <div className={styles.header}>
        <span className={styles.name}>{stop.zone_name}</span>

        <div className={styles.right}>
          {stop.violation_count > 0 && (
            <span className={styles.violation}>
              <AlertTriangle size={18} aria-hidden="true" />
              {stop.violation_count}
            </span>
          )}
          <ChevronRight size={18} className={styles.arrow} aria-hidden="true" />
        </div>
      </div>

      {stop.vehicle_thumbnails.length > 0 && (
        <div className={styles.thumbs}>
          {stop.vehicle_thumbnails.slice(0, 5).map((src, i) => (
            <div key={i} className={styles.thumb}>
              <Image src={src} alt="" width={36} height={24} unoptimized />
            </div>
          ))}
          {stop.vehicle_thumbnails.length > 5 && (
            <span className={styles.more}>+{stop.vehicle_thumbnails.length - 5}</span>
          )}
        </div>
      )}
    </button>
  )
}
