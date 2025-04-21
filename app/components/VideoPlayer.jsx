'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTimeController } from './TimeControllerContext';

export default function VideoPlayer({ videoId }) {
  const [player, setPlayer] = useState(null);
  const { register, setAdventureRelativeTime, getAdventureRelativeTime } = useTimeController(); // Access setAdventureRelativeTime
  const videoPlayerId = 'youtube-player'; // Unique ID for the YouTube player
  const isSending = useRef(false);
  const lastSendTime = useRef(0)

  useEffect(() => {
    // Register the VideoPlayer with the TimeController
    const unregister = register(videoPlayerId, () => {
        const newTime = getAdventureRelativeTime() / 1000; // Get the current relative time
      console.log('VideoPlayer received new time: ', newTime);
      if (player && !isSending) {
        player.seekTo(newTime / 1000, true); // Seek the video to the new time (convert ms to seconds)
      }
    });

    return () => unregister(); // Cleanup on unmount
  }, [register, player]);

  useEffect(() => {
    // Load the YouTube IFrame API script
    if (typeof window !== 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        if (!player) {
          const newPlayer = new window.YT.Player(videoPlayerId, {
            videoId, // Use the videoId prop passed to the component
            playerVars: {
              controls: 0, // Hide controls
              modestbranding: 1, // Remove YouTube logo
              rel: 0, // Disable related videos
              autoplay: 0, // Autoplay the video
            },
            events: {
              onReady: (event) => event.target.playVideo(),
              onStateChange: () => {
                const interval = setInterval(() => {
                  const time = newPlayer.getCurrentTime() * 1000; // Convert seconds to milliseconds
                  if (time !== lastSendTime.current) {
                    isSending.current = true;
                    setAdventureRelativeTime(time); // Set relative time on the TimeController
                    setTimeout(() => {
                      isSending.current = false;
                      lastSendTime.current = time; // Correctly update the ref
                    }, 50);
                  }
                }, 1000);

                // Clear the interval when the video state changes or the component unmounts
                return () => clearInterval(interval);
              },
            },
          });
          setPlayer(newPlayer);
        }
      };
    }
  }, [videoId, player, setAdventureRelativeTime]);

  return <div id={videoPlayerId} className="w-full lg:w-2/3 aspect-video"></div>;
}