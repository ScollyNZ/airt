'use client';

import { createContext, useContext, useRef, useState } from 'react';

const TimeControllerContext = createContext(null);

export function useTimeController() {
  return useContext(TimeControllerContext);
}

export function TimeControllerProvider({ children }) {
  const listeners = useRef(new Map()); // id => callback
  const adventureTime = useRef(0); // Current AdventureTime (milliseconds since epoch)
  const [adventureStartTime, setAdventureStartTime] = useState(0); // Adventure start time (milliseconds since epoch)

  const register = (id, setTimeCallback) => {
    listeners.current.set(id, setTimeCallback);
    return () => listeners.current.delete(id);
  };

  const setAdventureTime = (newAdventureTime, sourceId = null) => {
    adventureTime.current = newAdventureTime;
    notifyTimeChange(sourceId); // Notify all listeners about the new time
  };

  const notifyTimeChange = (sourceId = null) => {
    listeners.current.forEach((callBack, id) => {
      if (callBack !== sourceId) {
        callBack(); // Notify all listeners except the source
      }
    });
  }

  const setAdventureRelativeTime = (relativeTimeMilliseconds, sourceId = null) => {
    if (adventureStartTime === 0) {
      console.error('Adventure start time is not set.');
      return;
    }
    const absoluteAdventureTime = adventureStartTime + relativeTimeMilliseconds; // Convert relative time to absolute AdventureTime
    setAdventureTime(absoluteAdventureTime, sourceId); // Pass sourceId to suppress notifications
  };

  const resetTime = (sourceId = null) => {
    adventureTime.current = 0;
    setAdventureStartTime(0);
    notifyTimeChange(sourceId); // Notify all listeners about the reset
    };

  const setAdventureStartTimeWithLogging = (startTime, sourceId = null) => {
    console.log('Adventure Start Time set to:', startTime);
    setAdventureStartTime(startTime);
    setAdventureTime(adventureStartTime, sourceId); // Pass sourceId to suppress notifications
  };

  // Get the current AdventureTime (milliseconds since epoch)
  const getAdventureTime = () => {
    return adventureTime.current;
  };

  // Get the current AdventureRelativeTime (milliseconds since the adventure started)
  const getAdventureRelativeTime = () => {
    if (adventureStartTime === 0) {
      console.error('Adventure start time is not set.');
      return 0;
    }
    return adventureTime.current - adventureStartTime; // Return relative time in milliseconds
  };

  const value = {
    register,
    setAdventureTime, // Set the absolute AdventureTime
    setAdventureRelativeTime, // Set the AdventureRelativeTime
    setAdventureStartTime: setAdventureStartTimeWithLogging, // Set the adventure start time
    getAdventureTime, // Get the absolute AdventureTime
    getAdventureRelativeTime, // Get the AdventureRelativeTime
    resetTime, // Reset all times
  };

  return (
    <TimeControllerContext.Provider value={value}>
      {children}
    </TimeControllerContext.Provider>
  );
}
