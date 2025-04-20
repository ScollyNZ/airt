'use client';

import React, { useEffect, useState } from 'react';
import SegmentClock from './SegmentClock';
import { useTimeController } from './TimeControllerContext';

export default function AdventureClock() {
  const { register, getAdventureTime, getAdventureRelativeTime } = useTimeController();
  const [currentTime, setCurrentTime] = useState(0); // AdventureTime
  const [relativeTime, setRelativeTime] = useState(0); // AdventureRelativeTime

  // Format elapsed time as days, hours, minutes, seconds
  const formatElapsedTime = (relativeTime) => {
    const days = Math.floor(relativeTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((relativeTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((relativeTime / (1000 * 60)) % 60);
    const seconds = Math.floor((relativeTime / 1000) % 60);
console.log('Formatted elapsed time:', `${days}d ${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`);
    return `${days}d ${hours.toString().padStart(2, '0')}h:${minutes
      .toString()
      .padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  // Format real time as yyyy-mm-dd HH:mm
  const formatRealTime = (currentTime) => {
    const date = new Date(currentTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
console.log('Formatted real time:', `${year}-${month}-${day} ${hours}:${minutes}`);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    // Register the AdventureClock with the TimeController
    const unregister = register('adventure-clock', () => {
      console.log('AdventureClock received new time:');

      // Update the absolute AdventureTime
      const adventureTime = getAdventureTime();
      setCurrentTime(adventureTime);

      // Update the relative AdventureTime
      const adventureRelativeTime = getAdventureRelativeTime();
      setRelativeTime(adventureRelativeTime);
    });

    return () => unregister(); // Cleanup on unmount
  }, [register, getAdventureTime, getAdventureRelativeTime]);

  return (
    <div className="flex flex-col items-end">
      {/* Elapsed Time Clock */}
      <SegmentClock
        showSeconds
        formatTime={() =>
          relativeTime
            ? formatElapsedTime(relativeTime)
            : 'Not started'
        }
      />
      {/* Real-Time Clock */}
      <SegmentClock
        showSeconds
        formatTime={() =>
          currentTime ? formatRealTime(currentTime) : '--:--:--:--'
        }
        className="text-2xl" // Adjust font size for the real-time clock
      />
    </div>
  );
}