import React, { useEffect } from 'react';

function parseTimecode(tc) {
  const [h = 0, m = 0, s = 0] = tc.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

export default function EventTimeline({ points_of_interest, onSeekToTime, focusOnLocation }) {
  const poiList = points_of_interest ?? [];

  // Log the number of points of interest
  useEffect(() => {
    console.log(`Number of points of interest: ${poiList.length}`);
  }, [poiList]);

  return (
    <div className="bg-white rounded shadow p-4 overflow-y-auto max-h-[80vh]">
      <h2 className="text-lg font-bold mb-4">Event Timeline</h2>
      <ul className="space-y-2">
        {poiList.map((poi, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const timeInSeconds = parseTimecode(poi.timecode);
              onSeekToTime?.(timeInSeconds);
              focusOnLocation?.(poi.location.lat, poi.location.lng);
            }}
          >
            {/* Icon column – replace with images or SVGs if desired */}
            <span className="text-2xl">{poi.icon ?? '📍'}</span>

            {/* Timestamp */}
            <span className="text-sm font-mono text-blue-600 w-20">{poi.timecode}</span>

            {/* Title and Description */}
            <div>
              <div className="font-medium">{poi.title}</div>
              <div className="text-xs text-gray-500">{poi.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
