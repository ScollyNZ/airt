import React, { useState, useRef } from 'react';

// Inline styles for the timeline component
const timelineStyles = {
  container: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px 0',
    borderLeft: '2px solid #ddd',
    fontFamily: 'Arial, sans-serif',
    overflowY: 'auto', // Enable scrolling
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
  const timelineRef = useRef(null);

  // Function to handle real-time simulation and scroll to the next event
  const receiveRealTime = (realTime) => {
    if (!timelineRef.current) return;

    // Find the next event that will occur after the given realTime
    const nextEvent = points.find(
      (point) => new Date(point.time) > new Date(realTime)
    );

    if (nextEvent) {
      // Scroll to the next event
      const eventIndex = points.indexOf(nextEvent);
      const eventElement = timelineRef.current.children[eventIndex];
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setCurrentTime(nextEvent.time); // Update the current time state
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
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
