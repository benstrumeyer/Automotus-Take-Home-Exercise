'use client'

import { useCallback, useState } from 'react'
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
} from '@vis.gl/react-google-maps'
import type { QueueStop } from '@/types'
import { MapViewFallback } from './map-view-fallback'

interface MapViewProps {
  zones: QueueStop[]
  onMarkerTap: (zone: QueueStop) => void
  officerLocation?: { lat: number; lng: number }
}

const PRIORITY_COLORS = {
  high: '#ea492e',
  medium: '#F59E0B',
  clear: '#22C55E',
} as const

const DEFAULT_CENTER = { lat: 39.9500, lng: -75.1680 }
const DEFAULT_ZOOM = 16

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const MAP_ID = 'parking-enforcement-map'

function ZonePin({ color, count }: { color: string; count: number }) {
  const hasViolations = count > 0
  return (
    <svg
      aria-hidden="true"
      width={hasViolations ? 32 : 26}
      height={hasViolations ? 38 : 32}
      viewBox={hasViolations ? '0 0 32 38' : '0 0 26 32'}
      style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
    >
      <path
        d={hasViolations
          ? 'M4 0 H28 Q32 0 32 4 V22 Q32 25 30 26 L16 38 L2 26 Q0 25 0 22 V4 Q0 0 4 0Z'
          : 'M4 0 H22 Q26 0 26 4 V18 Q26 21 24 22 L13 32 L2 22 Q0 21 0 18 V4 Q0 0 4 0Z'}
        fill="white"
      />
      <path
        d={hasViolations
          ? 'M6 2 H26 Q30 2 30 6 V21 Q30 23.5 28.5 24.5 L16 35 L3.5 24.5 Q2 23.5 2 21 V6 Q2 2 6 2Z'
          : 'M6 2 H20 Q24 2 24 6 V17 Q24 19.5 22.5 20.5 L13 30 L3.5 20.5 Q2 19.5 2 17 V6 Q2 2 6 2Z'}
        fill={color}
      />
      {hasViolations && (
        <text
          x="16"
          y="16"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="12"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          {count}
        </text>
      )}
    </svg>
  )
}

function OfficerDot() {
  return (
    <div style={{ position: 'relative', width: 40, height: 40 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(66,133,244,0.2)',
          animation: 'officer-pulse 2s ease-out infinite',
        }}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ position: 'absolute', top: 10, left: 10 }}
      >
        <circle cx="10" cy="10" r="8" fill="#4285F4" stroke="white" strokeWidth="3" />
      </svg>
      <style>{`
        @keyframes officer-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="officer-pulse"] { animation: none; }
        }
      `}</style>
    </div>
  )
}

function GoogleMapView({ zones, onMarkerTap, officerLocation }: MapViewProps) {
  const getColor = useCallback((zone: QueueStop) => {
    if (zone.violation_count > 0) return PRIORITY_COLORS.high
    if (zone.approaching_count > 0) return PRIORITY_COLORS.medium
    return PRIORITY_COLORS.clear
  }, [])

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI
        style={{ width: '100%', height: '100%' }}
      >
        {zones.map((zone) => (
          <AdvancedMarker
            key={zone.zone_id}
            position={{ lat: zone.lat, lng: zone.lng }}
            onClick={() => onMarkerTap(zone)}
          >
            <ZonePin color={getColor(zone)} count={zone.violation_count} />
          </AdvancedMarker>
        ))}

        {officerLocation && (
          <AdvancedMarker position={officerLocation}>
            <OfficerDot />
          </AdvancedMarker>
        )}
      </GoogleMap>
    </APIProvider>
  )
}

export function MapView(props: MapViewProps) {
  const [googleFailed, setGoogleFailed] = useState(!GOOGLE_MAPS_API_KEY)

  if (googleFailed) {
    return <MapViewFallback {...props} />
  }

  return (
    <ErrorBoundaryWrapper onError={() => setGoogleFailed(true)}>
      <GoogleMapView {...props} />
    </ErrorBoundaryWrapper>
  )
}

// Minimal error boundary to catch Google Maps load failures
import React from 'react'

class ErrorBoundaryWrapper extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
