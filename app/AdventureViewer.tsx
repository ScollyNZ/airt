'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeartRateChart from './components/HeartRateChart';
import EventTimeLine from './components/EventTimeLine';
import AltitudeChart from './components/AltitudeChart';
import { parseStringPromise } from 'xml2js'; // Install this library with `npm install xml2js`

const adventureConfigUrl = '/data/adventure-config.json'; // Adjust to your storage path

async function AdventureStartTime(tcxFileUrl) {
  try {
    // Fetch the TCX file
    const response = await fetch(tcxFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch TCX file: ${response.statusText}`);
    }

    // Parse the TCX file content
    const fileContent = await response.text();
    const result = await parseStringPromise(fileContent);

    // Extract the first timestamp from the TCX file
    const trackpoints =
      result.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint;

    if (!trackpoints || trackpoints.length === 0) {
      throw new Error('No trackpoints found in the TCX file.');
    }

    // Get the first timestamp
    const firstTimestamp = trackpoints[0].Time[0];

    // Convert the timestamp to a JavaScript Date object
    return new Date(firstTimestamp).getTime() / 1000; // Return as seconds since epoch
  } catch (error) {
    console.error('Error retrieving adventure start time:', error);
    return null;
  }
}

export default function AdventureViewer() {
  const [config, setConfig] = useState(null);
  const [videoTime, setVideoTime] = useState(0);
  const [player, setPlayer] = useState(null);
  const [gpsData, setGpsData] = useState([]); // Store GPS coordinates for the map plot
  const [firstTimestamp, setFirstTimestamp] = useState(null);
  const [altitudeData, setAltitudeData] = useState([]); // Store altitude data

  useEffect(() => {
    // Fetch the adventure configuration
    fetch(adventureConfigUrl)
      .then((res) => res.json())
      .then(setConfig);
  }, []);

  useEffect(() => {
    async function fetchTcxFile() {
      if (!config?.heart_rate_file) return;

      try {
        const response = await fetch(config.heart_rate_file);
        if (!response.ok) {
          throw new Error(`Failed to fetch TCX file: ${response.statusText}`);
        }
        const fileContent = await response.text();
        const result = await parseStringPromise(fileContent);

        // Extract trackpoints
        const trackpoints =
          result.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint;

        // Extract GPS coordinates
        const gpsCoordinates = trackpoints
          .filter((point) => point.Position)
          .map((point) => [
            parseFloat(point.Position[0].LatitudeDegrees[0]),
            parseFloat(point.Position[0].LongitudeDegrees[0]),
          ]);

        setGpsData(gpsCoordinates);

        // Extract altitude data
        const altitudeData = trackpoints.map((point, index) => ({
          time: index, // Use the index as a placeholder for time
          altitude: parseFloat(point.AltitudeMeters?.[0] || 0),
        }));

        setAltitudeData(altitudeData);
      } catch (error) {
        console.error('Error parsing TCX file:', error);
      }
    }

    fetchTcxFile();
  }, [config]);

  useEffect(() => {
    async function fetchStartTime() {
      if (config?.heart_rate_file) {
        const startTime = await AdventureStartTime(config.heart_rate_file);
        setFirstTimestamp(startTime);
      }
    }

    fetchStartTime();
  }, [config]);

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
            playerVars: {
              controls: 0, // Hide all controls
              modestbranding: 1, // Remove YouTube logo
              rel: 0, // Disable related videos at the end
              showinfo: 0, // Hide video title and uploader info
              autoplay: 0, // Autoplay the video
            },
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

  // Define the onSeekToTime function
  const onSeekToTime = (absoluteTimeStamp) => {
    if (player && absoluteTimeStamp !== null) {
  
      player.seekTo(CalculateRelativeTime(absoluteTimeStamp), true); // Seek to the specified time
    }
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="relative flex flex-col h-screen w-4/5 mx-auto">
      {/* Adventure Clock */}
      <div className="absolute top-4 right-4">
       
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between bg-gray-100 p-4 shadow-md">
        <h1 className="text-2xl font-bold">{config.name}</h1>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="w-full lg:w-2/3 aspect-video" id="youtube-player"></div>
        <div className="w-full lg:w-1/3 p-4">
          <div className="flex flex-row h-96 w-full">
            {/* Map Section */}
            <MapContainer
              center={[
                config.points_of_interest[0].location.lat,
                config.points_of_interest[0].location.lng,
              ]}
              zoom={13}
              className="h-full w-2/3"
            >
              <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
              {config.points_of_interest.map((poi, i) => (
                <Marker
                  key={i}
                  position={[poi.location.lat, poi.location.lng]}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup(); // Open the popup on mouse over
                    },
                    mouseout: (e) => {
                      e.target.closePopup(); // Close the popup when the mouse leaves
                    },
                    click: () => {
                      const time = parseTimecode(poi.timecode);
                      if (player && time !== null) player.seekTo(time, true); // Sync with the video on click
                    },
                  }}
                >
                  <Popup>
                    <strong>{poi.title}</strong>
                    <br />
                    {poi.description}
                  </Popup>
                </Marker>
              ))}
              {/* Add a Polyline to plot the GPS data */}
              {gpsData.length > 0 && <Polyline positions={gpsData} color="blue" />}
            </MapContainer>

            {/* Event Timeline Section */}
            <div className="h-full w-1/3 overflow-y-auto">
              <EventTimeLine
                points_of_interest={config.points_of_interest}
                onSeekToTime={onSeekToTime} // Pass the onSeekToTime function
              />
            </div>
          </div>
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

      {/* Altitude Chart Section */}
      <div className="w-full mt-4">
        <AltitudeChart data={altitudeData} />
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

function CalculateRelativeTime(absoluteTimeStamp) {
  if (!absoluteTimeStamp || !firstTimestamp) {
    console.error('Invalid timestamps provided.');
    return null;
  }

  const relativeTime = absoluteTimeStamp - firstTimestamp;
  return Math.max(relativeTime, 0); // Ensure non-negative time
}


