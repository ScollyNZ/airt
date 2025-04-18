'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';

const SegmentClock = forwardRef(({ showSeconds = true, formatTime }, ref) => {
  const [time, setTime] = useState(getTimeString());

  // Expose the setTime function to parent components
  useImperativeHandle(ref, () => ({
    setTime: (newTime) => {
      setTime(formatTime ? formatTime(newTime) : defaultFormatTime(newTime));
    },
  }));

  function getTimeString() {
    const now = new Date();
    return formatTime ? formatTime(now) : defaultFormatTime(now);
  }

  function defaultFormatTime(date) {
    return date
      .toISOString()
      .replace('T', ' ')
      .slice(2, showSeconds ? 19 : 16); // Format as yy-MM-dd HH:mm:ss or yy-MM-dd HH:mm
  }

  return (
    <div className="bg-black p-4 rounded-lg shadow-md inline-block">
      <div className="text-green-200 text-5xl font-mono tracking-widest select-none digital-shadow">
        {time}
      </div>
    </div>
  );
});

export default SegmentClock;
