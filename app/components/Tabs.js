// components/Tabs.js
import React, { useState } from 'react';

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);

  return (
    <div className="w-full">
      <div className="flex border-b mb-4">
        {Object.keys(tabs).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`py-2 px-4 font-medium ${
              activeTab === tabKey
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tabKey}
          </button>
        ))}
      </div>
      <div className="p-4 border rounded bg-white shadow">
        {tabs[activeTab]}
      </div>
    </div>
  );
}
