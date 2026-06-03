import { useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiChevronUp,
  FiChevronDown,
  FiMinimize2,
  FiHeadphones,
  FiAlertCircle,
} from "react-icons/fi";
import { useAudioPlayback } from "../../hooks/useAudioPlayback";

const StickyPlayer = ({ src, title = "Audio Lesson", onClose }) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    speed,
    volume,
    isMuted,
    error,
    togglePlay,
    changeSpeed,
    changeVolume,
    toggleMute,
  } = useAudioPlayback(src);

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const handleSpeed = (value) => {
    const val = Number(value);
    changeSpeed(val);
    setShowSpeedMenu(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const formatTime = (time) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Hidden audio element managed by hook */}
      <audio ref={audioRef} preload="metadata" />

      {/* Progress Bar (top edge) */}
      <div className="h-1 bg-[#E2E8E3] cursor-pointer group">
        <div
          className="h-full bg-[#8FAF9A] transition-all duration-300 group-hover:bg-[#2E8B57]"
          style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
        />
      </div>

      {/* Main Player */}
      <div className="bg-white border-t border-[#E2E8E3] shadow-lg">
        {/* Error Message - if any */}
        {error && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-sm text-amber-700">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Play Button & Title */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={togglePlay}
                className="
                  w-10 h-10
                  rounded-full
                  bg-[#2E8B57]
                  hover:bg-[#257149]
                  active:scale-95
                  text-white
                  flex items-center justify-center
                  transition-all
                  duration-200
                  shadow-sm
                  hover:shadow-md
                  hover:scale-105
                  flex-shrink-0
                "
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <FiPause className="w-5 h-5" />
                ) : (
                  <FiPlay className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <FiHeadphones className="w-4 h-4 text-[#8FAF9A] flex-shrink-0" />
                  <p className="text-sm font-medium text-[#2C2C2C] truncate">
                    {title}
                  </p>
                </div>
                <p className="text-xs text-[#5F6B63]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] active:scale-95 transition-all duration-200"
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
                  aria-label="Volume control"
                />
              </div>

              {/* Speed Control Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-lg
                    text-sm
                    font-medium
                    bg-[#F1F4F1]
                    text-[#2C2C2C]
                    hover:bg-[#E2E8E3]
                    active:scale-95
                    transition-all
                    duration-200
                  "
                >
                  <span>{speed}x</span>
                  {showSpeedMenu ? (
                    <FiChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <FiChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showSpeedMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSpeedMenu(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-[#E2E8E3] py-1 z-50 min-w-[100px]">
                      {speedOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleSpeed(option)}
                          className={`
                            w-full px-3 py-1.5 text-xs text-left
                            transition-colors duration-200
                            hover:bg-[#F1F4F1]
                            ${
                              speed === option
                                ? "text-[#2E8B57] font-medium bg-[#F1F4F1]"
                                : "text-[#5F6B63]"
                            }
                          `}
                        >
                          {option}x
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyPlayer;
