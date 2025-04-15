'use client';
import AdventureViewer from './AdventureViewer';

// pages/index.js
import React from 'react';
import Tabs from './components/Tabs';

function TabOne() {
  return <div>Trip Brief</div>;
}

function TabTwo() {
  return <div><AdventureViewer /></div>;
}

function TabThree() {
  return <div>Trip Gear</div>;
}

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Adventure Tabs</h1>
      <Tabs
        tabs={{
          Brief: <TabOne />,
          Adventure: <TabTwo />,
          Gear: <TabThree />
        }}
      />
    </div>
  );
}

