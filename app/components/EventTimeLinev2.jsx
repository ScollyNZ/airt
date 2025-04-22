import React, { useState, useRef, useEffect } from 'react';
import { useTimeController } from './TimeControllerContext';

// Inline styles for the timeline component
const timelineStyles = {
  container: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px 0',
    borderLeft: '2px solid #ddd',
    fontFamily: 'Arial, sans-serif',
    overflowY: 'auto', // Enable scrolling within the container
    height: '500px', // Set a height for the scrollable container
  },
  point: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  },
  pointHover: {
    backgroundColor: '#d4f8d4', // Light green background on hover
  },
  nextEvent: {
    backgroundColor: '#d4f8d4', // Light green background for the next event
  },
  iconContainer: {
    position: 'absolute',
    left: '-18px',
    top: '0',
  },
  icon: {
    width: '50px',
    height: '50px',
  },
  labelContainer: {
    marginLeft: '40px',
    marginRight: '10px',
  },
  time: {
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    color: '#555',
    marginTop: '5px',
  },
};

const EventTimeLinev2 = ({ points }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track the hovered event
  const { register, getAdventureTime } = useTimeController();
  const [currentTime, setCurrentTime] = useState(0); // AdventureTime
  const [nextEvent, setNextEvent] = useState(null); // Track the next event
  const timelineRef = useRef(null);

  useEffect(() => {
    // Register the AdventureClock with the TimeController
    const unregister = register('event-time-line', () => {
      // Update the absolute AdventureTime
      const adventureTime = getAdventureTime();
      receiveCurrentTime(adventureTime);
    });

    return () => unregister(); // Cleanup on unmount
  }, [register, getAdventureTime]);

  // Function to handle real-time simulation and scroll to the next event
  const receiveCurrentTime = (adventureTime) => {
    if (!timelineRef.current) return;

    console.log('EventTimeLine received AdventureTime!:', adventureTime);

    // Find the next event that will occur after the given realTime
    const nextEvent = points.find(
      (point) =>
        new Date(adventureTime - 5000) < new Date(point.time) &&
        new Date(point.time) < new Date(adventureTime + 5000)
    );

    console.log('found Next event:', nextEvent);

    setNextEvent(nextEvent); // Update the next event state

    if (nextEvent) {
      // Scroll to the next event
      const eventIndex = points.indexOf(nextEvent);
      const eventElement = timelineRef.current.children[eventIndex];
      if (eventElement && timelineRef.current) {
        const offsetTop = eventElement.offsetTop;
        timelineRef.current.scrollTop = offsetTop; // Scroll the container to the top of the event
      }
    }
  };

  // Function to set the time when a user clicks on an event
  const setRealTime = (eventTime) => {
    setCurrentTime(eventTime);

    // Scroll to the clicked event
    const eventIndex = points.findIndex((point) => point.time === eventTime);
    if (eventIndex !== -1) {
      const eventElement = timelineRef.current.children[eventIndex];
      if (eventElement && timelineRef.current) {
        const offsetTop = eventElement.offsetTop;
        timelineRef.current.scrollTop = offsetTop; // Scroll the container to the top of the event
      }
    }
  };

  return (
    <div style={timelineStyles.container} ref={timelineRef}>
      {points.map((point, index) => (
        <div
          key={index}
          style={{
            ...timelineStyles.point,
            ...(hoveredIndex === index ? timelineStyles.pointHover : {}),
            ...(nextEvent === point ? timelineStyles.nextEvent : {}), // Apply nextEvent style
          }}
          onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
          onMouseLeave={() => setHoveredIndex(null)} // Clear hovered index on mouse leave
          onClick={() => setRealTime(point.time)} // Set real-time on click
        >
          <div style={timelineStyles.iconContainer}>
            {/* Dynamically load the icon based on the point type */}
            <img
              src={`/icons/${point.type}.png`}
              alt={point.type}
              style={timelineStyles.icon}
            />
          </div>
          <div style={timelineStyles.labelContainer}>
            <div style={timelineStyles.time}>{point.time}</div>
            <div style={timelineStyles.description}>{point.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventTimeLinev2;
