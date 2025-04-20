'use client';

import { createContext, useContext, useRef } from 'react';

const TimeControllerContext = createContext(null);

export function useTimeController() {
  return useContext(TimeControllerContext);
}

export function TimeControllerProvider({ children }) {
  const listeners = useRef(new Map()); // id => callback
  const currentTime = useRef(0);

  const register = (id, setTimeCallback) => {
    listeners.current.set(id, setTimeCallback);
    return () => listeners.current.delete(id);
  };

  const setTime = (newTime, sourceId = null) => {
    currentTime.current = newTime;

    listeners.current.forEach((cb, id) => {
      if (id !== sourceId) {
        cb(newTime);
      }
    });
  };

  const value = {
    register,
    setTime,
    getCurrentTime: () => currentTime.current
  };

  return (
    <TimeControllerContext.Provider value={value}>
      {children}
    </TimeControllerContext.Provider>
  );
}
