import { useRef, useState, useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiX,
  FiMinimize2,
} from "react-icons/fi";

const StickyAudioPlayer = ({ src, title = "Now Playing", onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10,
      );
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 10,
      );
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="
            group
            flex items-center gap-2
            bg-white
            border
            border-[#E2E8E3]
            rounded-full
            px-3 py-2
            shadow-lg
            hover:shadow-xl
            transition-all
            duration-200
            hover:scale-105
          "
        >
          <div className="w-2 h-2 bg-[#2E8B57] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-[#2C2C2C]">
            Now Playing
          </span>
          <FiPlay className="w-3 h-3 text-[#8FAF9A]" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Sticky Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Main Player */}
        <div className="bg-white border-t border-[#E2E8E3] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E2E8E3]">
              <div
                className="h-full bg-[#8FAF9A] transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
              {/* Title and Controls */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 flex items-center justify-center flex-shrink-0">
                    <FiPlay className="w-3.5 h-3.5 text-[#8FAF9A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2C2C2C] truncate max-w-[150px] sm:max-w-[200px]">
                      {title}
                    </p>
                    <p className="text-xs text-[#5F6B63]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Close/Minimize buttons */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200"
                    aria-label="Minimize"
                  >
                    <FiMinimize2 className="w-3.5 h-3.5" />
                  </button>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200"
                      aria-label="Close"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={skipBackward}
                  className="p-2 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200"
                  aria-label="Skip backward 10 seconds"
                >
                  <FiSkipBack className="w-4 h-4" />
                  <span className="text-[9px] ml-0.5">10</span>
                </button>

                <button
                  onClick={togglePlay}
                  className="
                    w-10 h-10
                    rounded-full
                    bg-[#2E8B57]
                    hover:bg-[#257149]
                    text-white
                    flex items-center justify-center
                    transition-all
                    duration-200
                    shadow-sm
                    hover:shadow-md
                    hover:scale-105
                  "
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <FiPause className="w-5 h-5" />
                  ) : (
                    <FiPlay className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="p-2 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200"
                  aria-label="Skip forward 10 seconds"
                >
                  <FiSkipForward className="w-4 h-4" />
                  <span className="text-[9px] mr-0.5">10</span>
                </button>
              </div>

              {/* Volume Control */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all duration-200"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <FiVolumeX className="w-4 h-4" />
                  ) : (
                    <FiVolume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 rounded-lg appearance-none cursor-pointer bg-[#E2E8E3] accent-[#8FAF9A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyAudioPlayer;
