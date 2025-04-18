'use client';
import AdventureViewer from './AdventureViewer';
import SegmentClock from './components/SegmentClock';
import React from 'react';
import Tabs from './components/Tabs';

function TabTripBrief() {
  return <div>Trip Brief</div>;
}

function TabAdventureViewer() {
  return (
    <div>
      <AdventureViewer />
    </div>
  );
}

function TabTripGear() {
  return <div>Trip Gear</div>;
}

function TabTripDebrief() {
  return <div>Debrief</div>;
}

export default function Home() {
  const adventureStartTime = new Date('2025-04-15T12:00:00Z').getTime(); // Example start time

  // Custom formatter for elapsed time
  const formatElapsedTime = (date) => {
    const now = Date.now();
    const diff = now - date.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d:${hours.toString().padStart(2, '0')}h:${minutes
      .toString()
      .padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="max-w-9/10 mx-auto mt-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Title on the left */}
        <h1 className="text-2xl font-bold">Adventures In Real Time</h1>
        {/* Adventure Clocks on the right */}
        <div className="flex flex-col items-end">
          {/* Elapsed Time Clock */}
          <SegmentClock
            showSeconds
            formatTime={() => formatElapsedTime(new Date(adventureStartTime))}
          />
          {/* Real-Time Clock */}
          <SegmentClock
            showSeconds
            className="text-2xl" // Adjust font size for the real-time clock
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        tabs={{
          Brief: <TabTripBrief />,
          Gear: <TabTripGear />,
          Adventure: <TabAdventureViewer />,
          Debrief: <TabTripDebrief />,
        }}
      />
    </div>
  );
}

