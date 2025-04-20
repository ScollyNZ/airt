'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useTimeController } from './TimeControllerContext';
import 'leaflet/dist/leaflet.css';

export default function AdventureMap({
  pointsOfInterest,
  gpsData,
  onMarkerClick,
}: {
  pointsOfInterest: Array<{
    location: { lat: number; lng: number };
    title: string;
    description: string;
    timecode: string;
  }>;
  gpsData: Array<[number, number]>;
  onMarkerClick: (time: number) => void;
}) {
  const { register, getAdventureRelativeTime } = useTimeController();

  useEffect(() => {
    // Register the AdventureMap with the TimeController
    const unregister = register('adventure-map', () => {
      const relativeTime = getAdventureRelativeTime();
      console.log('AdventureMap received relative time:', relativeTime);

      // Optionally, you can add logic here to update the map based on the relative time
    });

    return () => unregister(); // Cleanup on unmount
  }, [register, getAdventureRelativeTime]);

  return (
    <MapContainer
      center={[pointsOfInterest[0].location.lat, pointsOfInterest[0].location.lng]}
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
      {pointsOfInterest.map((poi, i) => (
        <Marker
          key={i}
          position={[poi.location.lat, poi.location.lng]}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
            },
            mouseout: (e) => {
              e.target.closePopup();
            },
            click: () => {
              const time = parseTimecode(poi.timecode);
              if (time !== null) onMarkerClick(time);
            },
          }}
        >
          <Popup>
            <strong>{poi.title}</strong>
            <br />
            {poi.description}
          </Popup>
        </Marker>
      ))}
      {gpsData.length > 0 && <Polyline positions={gpsData} color="blue" />}
    </MapContainer>
  );
}

function parseTimecode(timecode: string): number | null {
  const parts = timecode.split(':').map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
}