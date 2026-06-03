import { useRef, useState, useEffect, useCallback } from "react";
import {
  playAudioSafely,
  onFirstUserInteraction,
  isMobileDevice,
} from "../utils/audioUtils";

/**
 * Custom hook for managing audio playback with auto-play, cleanup, and mobile support
 * Handles browser autoplay restrictions and ensures proper resource cleanup
 */
export const useAudioPlayback = (audioSrc) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const autoplayAttemptedRef = useRef(false);
  const interactionListenerAddedRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    // Event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0; // Reset to beginning
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      console.error("Audio error:", audio.error?.message);
      setError(
        `Failed to load audio: ${audio.error?.message || "Unknown error"}`,
      );
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Define attemptPlayback function first (used by attemptAutoplay)
  const attemptPlayback = useCallback(async (audio) => {
    try {
      // Try to play with the safe method
      const playSucceeded = await playAudioSafely(audio);
      if (playSucceeded) {
        setIsPlaying(true);
        setError(null);
      } else {
        // Autoplay prevented - this is normal on mobile
        setError(null); // Don't show error, user can click play
        setIsPlaying(false);

        // Register for user interaction on mobile
        if (isMobileDevice() && !interactionListenerAddedRef.current) {
          interactionListenerAddedRef.current = true;
          onFirstUserInteraction(async () => {
            const success = await playAudioSafely(audio);
            if (!success) {
              setError("Failed to play audio. Please try again.");
            }
          });
        }
      }
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
    }
  }, []);

  // Attempt to autoplay with proper error handling
  const attemptAutoplay = useCallback(async () => {
    if (!audioRef.current || !audioSrc || autoplayAttemptedRef.current) return;

    autoplayAttemptedRef.current = true;
    const audio = audioRef.current;

    try {
      // Ensure audio is loaded
      if (audio.readyState < 2) {
        // Not enough data yet, wait for it
        audio.addEventListener(
          "canplay",
          () => {
            attemptPlayback(audio);
          },
          { once: true },
        );
      } else {
        attemptPlayback(audio);
      }
    } catch (err) {
      console.error("Autoplay attempt error:", err);
      // On mobile or if autoplay is blocked, set up interaction listener
      if (!interactionListenerAddedRef.current) {
        interactionListenerAddedRef.current = true;
        onFirstUserInteraction(() => {
          attemptAutoplay().catch(() => {
            // Fallback already handled
          });
        });
      }
    }
  }, [audioSrc, attemptPlayback]);

  // Handle src changes - stop current audio and load new one
  useEffect(() => {
    if (!audioRef.current || !audioSrc) return;

    const audio = audioRef.current;

    // Stop any currently playing audio
    if (audio.paused === false) {
      audio.pause();
    }

    // Reset playback state
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    setError(null);
    autoplayAttemptedRef.current = false;
    interactionListenerAddedRef.current = false; // Reset for new audio

    // Set new src
    audio.src = audioSrc;

    // Try to autoplay after a short delay to ensure audio is loaded
    const autoplayTimeout = setTimeout(() => {
      attemptAutoplay();
    }, 100);

    return () => clearTimeout(autoplayTimeout);
  }, [audioSrc, attemptAutoplay]);

  // Manual play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (audio.paused) {
      playAudioSafely(audio)
        .then((success) => {
          if (success) {
            setIsPlaying(true);
            setError(null);
          } else {
            setError("Failed to play audio");
            setIsPlaying(false);
          }
        })
        .catch((err) => {
          console.error("Play error:", err);
          setError("Failed to play audio");
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  // Seek to time
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Handle speed change
  const changeSpeed = useCallback((newSpeed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
      setSpeed(newSpeed);
    }
  }, []);

  // Handle volume change
  const changeVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Stop and cleanup
  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      // Reset refs
      autoplayAttemptedRef.current = false;
      interactionListenerAddedRef.current = false;
    };
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    speed,
    volume,
    isMuted,
    error,
    togglePlay,
    seek,
    changeSpeed,
    changeVolume,
    toggleMute,
    stop,
  };
};
