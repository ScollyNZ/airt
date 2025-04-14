'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const adventureConfigUrl = '/data/adventure-config.json'; // Adjust to your storage path

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
    <div className="flex flex-col lg:flex-row h-screen">
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
  );
}

function parseTimecode(tc) {
  if (typeof tc !== 'string') return null;
  const parts = tc.split(':');
  if (parts.length !== 3 || parts.some((p) => isNaN(Number(p)))) return null;

  const [h, m, s] = parts.map(Number);
  return h * 3600 + m * 60 + s;
}
