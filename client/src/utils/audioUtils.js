/**
 * Audio Autoplay Detection and Mobile Support Utilities
 * Helps handle browser autoplay policies and mobile restrictions
 */

/**
 * Detects if browser allows audio autoplay
 * @returns {Promise<boolean>} - true if autoplay is allowed
 */
export const canAutoplay = async () => {
  try {
    const audio = new Audio();
    audio.muted = true;
    audio.src =
      "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=";

    const playPromise = audio.play();
    if (playPromise === undefined) {
      // Synchronous play (older browsers)
      audio.pause();
      return true;
    }

    await playPromise;
    audio.pause();
    return true;
  } catch (error) {
    // Autoplay blocked or other error
    return false;
  }
};

/**
 * Check if device is mobile based on user agent
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;

  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(navigator.userAgent);
};

/**
 * Get browser info for debugging audio issues
 * @returns {object} - Browser info
 */
export const getBrowserInfo = () => {
  return {
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    isMobile: isMobileDevice(),
    isHTTPS:
      typeof window !== "undefined"
        ? window.location.protocol === "https:"
        : false,
    isStandalone:
      typeof window !== "undefined"
        ? window.navigator.standalone === true ||
          window.matchMedia("(display-mode: standalone)").matches
        : false,
  };
};

/**
 * Log audio error for debugging mobile issues
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logAudioError = (error, context = "") => {
  const errorInfo = {
    name: error?.name,
    message: error?.message,
    timestamp: new Date().toISOString(),
    context,
    browser: getBrowserInfo(),
  };

  console.error("[Audio Error]", errorInfo);

  // Store in sessionStorage for debugging
  try {
    const stored = sessionStorage.getItem("audioErrors") || "[]";
    const errors = JSON.parse(stored);
    errors.push(errorInfo);
    sessionStorage.setItem("audioErrors", JSON.stringify(errors.slice(-10))); // Keep last 10
  } catch (e) {
    // Ignore storage errors
  }
};

/**
 * Handle audio play with proper error handling for mobile
 * @param {HTMLAudioElement} audio - Audio element
 * @returns {Promise<boolean>} - true if play succeeded, false otherwise
 */
export const playAudioSafely = async (audio) => {
  if (!audio) return false;

  try {
    const playPromise = audio.play();

    if (playPromise === undefined) {
      // Synchronous play (older browsers)
      return true;
    }

    await playPromise;
    return true;
  } catch (error) {
    logAudioError(error, "playAudioSafely");
    return false;
  }
};

/**
 * Add event listener for user interaction to enable audio on mobile
 * (helps bypass some autoplay restrictions)
 * @param {Function} callback - Callback when user interacts
 */
export const onFirstUserInteraction = (callback) => {
  const handleInteraction = () => {
    callback();
    // Remove listener after first interaction
    document.removeEventListener("click", handleInteraction);
    document.removeEventListener("touch", handleInteraction);
    document.removeEventListener("keydown", handleInteraction);
  };

  document.addEventListener("click", handleInteraction, { once: true });
  document.addEventListener("touch", handleInteraction, { once: true });
  document.addEventListener("keydown", handleInteraction, { once: true });
};
