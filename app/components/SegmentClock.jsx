'use client';

import React from 'react';

const SegmentClock = ({ formatTime }) => {
  return (
    <div className="bg-black p-4 rounded-lg shadow-md inline-block">
      <div className="text-green-200 text-5xl font-mono tracking-widest select-none digital-shadow">
        {formatTime()}
      </div>
    </div>
  );
};

export default SegmentClock;
