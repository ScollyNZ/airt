'use client';

import React, { useState } from 'react';

export default function Tabs({ tabs }: { tabs: { [key: string]: React.ReactNode } }) {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]); // Default to the first tab

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {Object.entries(tabs).map(([tab, content]) => (
          <div
            key={tab}
            style={{ display: activeTab === tab ? 'block' : 'none' }} // Hide inactive tabs
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}