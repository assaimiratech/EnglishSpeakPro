import { useEffect, useRef } from "react";

const AudioPlayer = ({ url, speed = 1 }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <div className="bg-[#F1F4F1] dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 transition-colors duration-200">
      <audio
        controls
        ref={audioRef}
        className="w-full rounded-lg transition-colors duration-200
          [&::-webkit-media-controls-panel]:bg-[#F1F4F1] 
          dark:[&::-webkit-media-controls-panel]:bg-[var(--card)]
          [&::-webkit-media-controls-play-button]:text-[#2E8B57] 
          dark:[&::-webkit-media-controls-play-button]:text-[var(--accent)]
          [&::-webkit-media-controls-current-time-display]:text-[#5F6B63]
          dark:[&::-webkit-media-controls-current-time-display]:text-[var(--muted)]
          [&::-webkit-media-controls-time-remaining-display]:text-[#5F6B63]
          dark:[&::-webkit-media-controls-time-remaining-display]:text-[var(--muted)]
          [&::-webkit-media-controls-timeline]:bg-[#E2E8E3]
          dark:[&::-webkit-media-controls-timeline]:bg-[var(--border)]
          [&::-webkit-media-controls-volume-slider]:bg-[#E2E8E3]
          dark:[&::-webkit-media-controls-volume-slider]:bg-[var(--border)]
        "
      >
        <source src={url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
