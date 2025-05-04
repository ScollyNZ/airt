'use client';

import React, { useEffect, useState } from 'react';
import AdventureMap from './components/AdventureMap';
import HeartRateChart from './components/HeartRateChart';
import EventTimeLine from './components/EventTimeLine';
import AltitudeChart from './components/AltitudeChart';
import VideoPlayer from './components/VideoPlayer';
import { parseStringPromise } from 'xml2js';

export default function AdventureViewer({ config }) {
  const [videoTime, setVideoTime] = useState(0);
  const [gpsData, setGpsData] = useState([]);
  const [altitudeData, setAltitudeData] = useState([]);

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
          time: index,
          altitude: parseFloat(point.AltitudeMeters?.[0] || 0),
        }));

        setAltitudeData(altitudeData);
      } catch (error) {
        console.error('Error parsing TCX file:', error);
      }
    }

    fetchTcxFile();
  }, [config]);

  if (!config) return <div>Loading...</div>;

  return (
    <div className="relative flex flex-col h-screen w-4/5 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between bg-gray-100 p-4 shadow-md">
        <h1 className="text-2xl font-bold">{config.name}</h1>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Video Player Section */}
        <VideoPlayer videoId={config.videos[0].youtube_id} />
        <div className="w-full lg:w-1/4 p-4">
          <div className="flex flex-row h-96 w-full">
            {/* Map Section */}
            <AdventureMap
              pointsOfInterest={config.points_of_interest}
              gpsData={gpsData}
              onMarkerClick={(time) => setVideoTime(time)}
            />

            {/* Event Timeline Section */}
            <div className="h-full w-1/3 overflow-y-auto">
              <EventTimeLine
                points_of_interest={config.points_of_interest}
                onSeekToTime={(time) => setVideoTime(time)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Altitude Chart Section */}
      <div className="w-full mt-4">
        <AltitudeChart data={altitudeData} />
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


