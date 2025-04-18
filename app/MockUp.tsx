'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MockUp() {
  return (
    <div className="h-screen w-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-green-800 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Adventures in Real Time</h1>
        <p className="text-sm text-green-200">Explore immersive, real-world journeys</p>
      </header>

      <div className="flex h-[calc(100%-80px)]">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 p-4 space-y-4 overflow-y-auto">
          {/* YouTube Video */}
          <div className="aspect-video bg-black rounded shadow">
            <iframe
              className="w-full h-full rounded"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Adventure Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Chart */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Heart Rate & Calorie Burn</h2>
            <div className="h-48 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-400">
              [Chart Placeholder]
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 p-4 space-y-4 border-l border-gray-300 bg-white">
          {/* Adventure Summary */}
          <div>
            <h2 className="text-xl font-bold">Mountain Adventure</h2>
            <p className="text-sm text-gray-600">
              A thrilling hike through the mountains, filled with stunning landscapes and challenging terrain.
            </p>
          </div>

          {/* Map */}
          <div className="h-64 rounded overflow-hidden shadow">
            <MapContainer center={[-36.8485, 174.7633]} zoom={11} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenTopoMap contributors"
              />
              <Marker position={[-36.8485, 174.7633]}>
                <Popup>Start Point</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Points of Interest */}
          <div className="bg-gray-50 p-3 rounded shadow">
            <h3 className="font-semibold mb-2">Points of Interest</h3>
            <ul className="space-y-2 text-sm">
              <li>🗻 Summit Reach – 1:34:23</li>
              <li>🌉 River Crossing – 2:15:10</li>
              <li>🥝 Kiwi Sighting – 3:42:01</li>
              <li>🍫 Snack Break – 4:20:11</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
