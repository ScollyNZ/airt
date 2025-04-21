'use client';
import React, { useEffect, useState } from 'react';
import AdventureViewer from './AdventureViewer';
import Tabs from './components/Tabs';
import MarkdownRenderer from './components/MarkdownRenderer';
import AdventureClock from './components/AdventureClock';
import EventTimeLinev2 from './components/EventTimeLinev2';
import { useTimeController } from './components/TimeControllerContext';


const pointsOfInterest = [
  { time: '2025-04-15T16:36:00', description: 'Your parcel has been delivered by your local courier driver based at Christchurch East Depot', type: 'climb'},
  { time: '2025-04-15T08:21:00', description: 'Your item is with our courier for delivery. It should be with you today',type: 'summit' },
  { time: '2025-04-15T04:55:00', description: 'Your parcel has been processed',type:'headlamp' },
  { time: '2025-04-14T20:15:00', description: 'Your parcel has been processed',type:'crampon' },
];

function TabTripBrief({ briefText }) {
  return <div><MarkdownRenderer markdown={briefText}/></div>;
}

function TabAdventureViewer({ config }) {
  return (
    <div>
      <AdventureViewer config={config} />
    </div>
  );
}

function TabTest() {
  return (
    <div>
      <EventTimeLinev2 points={pointsOfInterest} />
    </div>
  );
}

function TabTripGear() {
  return <div>Trip Gear</div>;
}

function TabTripFood() {
  return <div>Food</div>;
}

function TabTripDebrief() {
  return <div>Debrief</div>;
}

interface TabsProps {
  tabs: {
    [key: string]: React.ReactNode;
  };
}

export default function Home() {
  const [config, setConfig] = useState(null);
  const [adventureBrief, setAdventureBrief] = useState(null);
  const adventureStartTime = null;
  const { setAdventureStartTime } = useTimeController(); // Access the TimeController

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/data/mt-murchison-2025-04-23/adventure-config.json');
        const adventure_config = await response.json();
        setConfig(adventure_config);
        setAdventureStartTime(new Date(adventure_config.adventureStartTime).getTime());

        const briefResponse = await fetch(adventure_config.adventureBriefFile);
        const briefText = await briefResponse.text();
        setAdventureBrief(briefText);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    fetchConfig();
  }, [setAdventureStartTime]);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-9/10 mx-auto mt-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Title on the left */}
        <h1 className="text-2xl font-bold">Adventures In Real Time</h1>
        {/* Adventure Clocks on the right */}
        <AdventureClock/>
      </div>

      {/* Tabs Section */}
      <Tabs
        tabs={{
          Brief: <TabTripBrief briefText={adventureBrief}/>,
          Gear: <TabTripGear />,
          Food: <TabTripFood />,
          Adventure: <TabAdventureViewer config={config} />, // Pass config as a prop
          Debrief: <TabTripDebrief />,
          Test: <TabTest />,
        }}
      />
    </div>
  );
}

