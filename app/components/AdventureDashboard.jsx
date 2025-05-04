import React, { useState, useEffect } from 'react';
import './AdventureDashboard.css'; // Adjust the path to where your CSS file is located


// Helper function for creating circular gauges
const Gauge = ({ value, maxValue, label, color }) => {
  const percentage = (value / maxValue) * 100;
  const rotate = percentage * 1.8 - 90; // Rotates the needle (starting from -90 degrees)
  
  return (
    <div className="gauge-container">
      <div className="gauge">
        <div className="gauge-inner" style={{ transform: `rotate(${rotate}deg)` }} />
      </div>
      <div className="gauge-label">{label}: {value}</div>
    </div>
  );
};

const AdventureDashboard = () => {
  const [heartRate, setHeartRate] = useState(75);
  const [speed, setSpeed] = useState(15);
  const [rateOfClimb, setRateOfClimb] = useState(3);
  const [altitude, setAltitude] = useState(1500);
  const [distance, setDistance] = useState(10);
  const [temperature, setTemperature] = useState(22);
  const [angle, setAngle] = useState(0); // for artificial horizon
  
  // Placeholder for updating metrics, replace with real-time data if needed
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(Math.random() * 100 + 60);
      setSpeed(Math.random() * 20 + 10);
      setRateOfClimb(Math.random() * 10);
      setAltitude(Math.random() * 3000 + 1000);
      setDistance(Math.random() * 100);
      setTemperature(Math.random() * 10 + 15);
      setAngle(Math.random() * 45); // Simulating terrain change
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="dashboard">
      <h1>Adventure Dashboard</h1>
      
      <div className="gauge-row">
        <Gauge value={heartRate} maxValue={200} label="Heart Rate (BPM)" color="red" />
        <Gauge value={speed} maxValue={150} label="Speed (km/h)" color="blue" />
        <Gauge value={rateOfClimb} maxValue={20} label="Rate of Climb (m/min)" color="green" />
      </div>
      
      <div className="gauge-row">
        <Gauge value={altitude} maxValue={4000} label="Altitude (m)" color="orange" />
        <Gauge value={distance} maxValue={100} label="Distance (km)" color="purple" />
        <Gauge value={temperature} maxValue={40} label="Temperature (°C)" color="yellow" />
      </div>
      
      <div className="artificial-horizon">
        <h3>Artificial Horizon</h3>
        <div className="horizon-bar" style={{ transform: `rotate(${angle}deg)` }} />
      </div>
    </div>
  );
};

export default AdventureDashboard;
