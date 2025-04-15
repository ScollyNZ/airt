'use client';
import AdventureViewer from './AdventureViewer';

// pages/index.js
import React from 'react';
import Tabs from './components/Tabs';

function TabTripBrief() {
  return <div>Trip Brief</div>;
}

function TabAdventureViewer() {
  return <div><AdventureViewer /></div>;
}

function TabTripGear() {
  return <div>Trip Gear</div>;
}

function TabTripDebrief() {
  return <div>Debrief</div>;
}

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Adventure Tabs</h1>
      <Tabs
        tabs={{
          Brief: <TabTripBrief />,
          Gear: <TabTripGear />,
          Adventure: <TabAdventureViewer />,
          Debrief: <TabTripDebrief />
        }}
      />
    </div>
  );
}

