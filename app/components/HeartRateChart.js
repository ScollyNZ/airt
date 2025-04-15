import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { parseStringPromise } from 'xml2js'; // Install this library with `npm install xml2js`

export default function HeartRateChart({ filename, videoTime, age, weight, gender }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);

  useEffect(() => {
    async function parseTCXFile() {
      try {
        // Fetch the TCX file content
        const response = await fetch(filename);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const fileContent = await response.text();

        // Parse the TCX file content
        const result = await parseStringPromise(fileContent);

        // Extract heart rate data from the TCX file
        const trackpoints = result.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint;

        // Calculate the offset using the first timestamp
        const firstTimestamp = parseTimeToSeconds(trackpoints[0].Time[0]);

        const formattedData = trackpoints.map((point) => ({
          time: parseTimeToSeconds(point.Time[0]) - firstTimestamp, // Make timestamps relative
          heartrate: parseInt(point.HeartRateBpm[0].Value[0], 10),
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error parsing TCX file:', error);
      }
    }

    parseTCXFile();
  }, [filename]);

  useEffect(() => {
    // Filter data to show only the last 60 seconds relative to videoTime
    const startTime = Math.max(videoTime - 60, 0); // Ensure startTime is not negative
    const endTime = videoTime;
    const visibleData = data.filter((point) => point.time >= startTime && point.time <= endTime);
    setFilteredData(visibleData);
  }, [videoTime, data]);

  useEffect(() => {
    // Calculate cumulative calories burned based on heart rate
    const cumulativeCalories = [];
    let totalCalories = 0;

    data.forEach((point, index) => {
      const hr = point.heartrate;
      const caloriesPerMinute =
        gender === 'male'
          ? (-55.0969 + 0.6309 * hr + 0.1988 * weight + 0.2017 * age) / 4.184
          : (-20.4022 + 0.4472 * hr - 0.1263 * weight + 0.074 * age) / 4.184;

      const caloriesPerSecond = caloriesPerMinute / 60;
      totalCalories += caloriesPerSecond;

      cumulativeCalories.push({
        time: point.time,
        calories: totalCalories,
      });
    });

    setCalorieData(cumulativeCalories);
  }, [data, age, weight, gender]);

  // Helper function to convert ISO time to seconds
  function parseTimeToSeconds(isoTime) {
    const date = new Date(isoTime);
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  // Helper function to format time to hours and minutes
  function formatTimeToHoursMinutes(seconds) {
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Ensure two-digit minutes
  }

  return (
    <div className="w-full h-64 bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Heart Rate and Calorie Burn Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            domain={[Math.max(videoTime - 60, 0), Math.max(videoTime, 60)]} // Always show 60 seconds
            type="number"
            label={{ value: 'Time (h:mm)', position: 'insideBottomRight', offset: -5 }}
            tickFormatter={(time) => formatTimeToHoursMinutes(time)} // Format ticks
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Calories', angle: -90, position: 'insideRight' }}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="heartrate"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            data={filteredData}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="calories"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            data={calorieData}
          />
          {/* Add a marker (ReferenceDot) to highlight the current video time */}
          {/*filteredData.length > 0 && filteredData.some((point) => point.time >= videoTime) && (
            <ReferenceDot
              x={videoTime}
              y={filteredData.find((point) => point.time >= videoTime)?.heartrate || 0}
              r={5}
              fill="blue"
              stroke="none"
            />
          )*/}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}