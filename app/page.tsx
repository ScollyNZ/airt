'use client';
import React, { useEffect, useState } from 'react';
import AdventureViewer from './AdventureViewer';
import Tabs from './components/Tabs';
import MarkdownRenderer from './components/MarkdownRenderer';
import AdventureClock from './components/AdventureClock';
import EventTimeLinev2 from './components/EventTimeLinev2';
import AdventureDashboard from './components/AdventureDashboard';
import { useTimeController } from './components/TimeControllerContext';


const pointsOfInterest = [
  { time: 'Tue Dec 31 2024 11:00:02 GMT+1300', description: 'climbing event', type: 'climb'},
  { time: 'Tue Dec 31 2024 11:00:12 GMT+1300', description: 'summit',type: 'summit' },
  { time: 'Tue Dec 31 2024 11:00:22 GMT+1300', description: 'headlamp event',type:'headlamp' },
  { time: 'Tue Dec 31 2024 11:00:32 GMT+1300', description: 'crampon event',type:'crampon' },
  { time: 'Tue Dec 31 2024 11:00:42 GMT+1300', description: 'headlamp event',type:'headlamp' },
  { time: 'Tue Dec 31 2024 11:00:52 GMT+1300', description: 'crampon event',type:'crampon' },
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

function TabDashboard() {
  return (
    <div>
      <AdventureDashboard />
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
        const response = await fetch('/data/halswell-quarry-2025-04-27/adventure-config.json');
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
          Dashboard: <TabDashboard />,
        }}
      />
    </div>
  );
}

