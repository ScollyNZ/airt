'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeartRateChart from './components/HeartRateChart'

const adventureConfigUrl = '/data/adventure-config.json'; // Adjust to your storage path

// extract the heart_rate_file paramter elementfrom the adventure-config.json

export default function AdventureViewer() {
  const [config, setConfig] = useState(null);
  const [videoTime, setVideoTime] = useState(0);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    // Fetch the adventure configuration
    fetch(adventureConfigUrl)
      .then((res) => res.json())
      .then(setConfig);
  }, []);

  useEffect(() => {
    // Load the YouTube IFrame API script
    if (typeof window !== 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      // Set up the YouTube API ready callback
      window.onYouTubeIframeAPIReady = () => {
        if (config && !player) {
          const newPlayer = new window.YT.Player('youtube-player', {
            videoId: config.videos[0].youtube_id,
            events: {
              onReady: (event) => event.target.playVideo(),
              onStateChange: () => {
                const interval = setInterval(() => {
                  const time = newPlayer.getCurrentTime();
                  console.log('Current Time:', time);
                  setVideoTime(time);
                }, 1000);
                return () => clearInterval(interval);
              },
            },
          });
          setPlayer(newPlayer);
        }
      };
    }
  }, [config, player]);

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-4/5 mx-auto">
      {/* Video and Map Section */}
      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="w-full lg:w-2/3 aspect-video" id="youtube-player"></div>
        <div className="w-full lg:w-1/3 p-4">
          <h1 className="text-xl font-bold mb-2">{config.name}</h1>
          <p className="mb-4">{config.description}</p>

          <MapContainer
            center={[
              config.points_of_interest[0].location.lat,
              config.points_of_interest[0].location.lng,
            ]}
            zoom={13}
            className="h-96 w-full"
          >
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
            {config.points_of_interest.map((poi, i) => (
              <Marker key={i} position={[poi.location.lat, poi.location.lng]}>
                <Popup>
                  <strong>{poi.title}</strong>
                  <br />
                  {poi.description}
                  <br />
                  <button
                    className="text-blue-500 underline mt-1"
                    onClick={() => {
                      const time = parseTimecode(poi.timecode);
                      if (player && time !== null) player.seekTo(time, true);
                    }}
                  >
                    Go to Time
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Heart Rate Chart Section */}
      <div className="w-full mt-4">
        {config?.heart_rate_file ? (
          <HeartRateChart
            filename={config.heart_rate_file}
            videoTime={videoTime}
            age={config.user.age}
            weight={config.user.weight}
            gender={config.user.gender}
          />
        ) : (
          <p>Loading heart rate data...</p>
        )}
      </div>
    </div>
  );
}

function parseTimecode(tc) {
  if (typeof tc !== 'string') return null;
  const parts = tc.split(':');
  if (parts.length !== 3 || parts.some((p) => isNaN(Number(p)))) return null;

  const [h, m, s] = parts.map(Number);
  return h * 3600 + m * 60 + s;
}
