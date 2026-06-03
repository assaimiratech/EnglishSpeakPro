# Audio Playback System - Technical Documentation

## Overview

The audio playback system has been completely redesigned to handle auto-play, mobile compatibility, and proper resource management. The system now works seamlessly across desktop and mobile devices while respecting browser autoplay policies.

## Architecture

### Custom Hook: `useAudioPlayback`

**File**: `client/src/hooks/useAudioPlayback.js`

The core of the audio system. This hook manages:

- Audio element lifecycle and state
- Auto-play on src changes with proper cleanup
- Event listeners (play, pause, timeupdate, ended, error)
- Playback controls (play/pause, speed, volume, mute)
- Mobile autoplay restrictions handling
- Error management and user feedback

**Hook Return Values**:

```javascript
{
  audioRef,           // Reference to audio element
  isPlaying,          // Current playback state
  currentTime,        // Current playback position (seconds)
  duration,           // Total audio duration (seconds)
  speed,              // Playback speed (0.5x - 2x)
  volume,             // Volume level (0-1)
  isMuted,            // Mute state
  error,              // Error message (if any)
  togglePlay,         // Play/pause function
  seek,               // Seek to time function
  changeSpeed,        // Change playback speed
  changeVolume,       // Change volume
  toggleMute,         // Toggle mute
  stop,               // Stop and reset audio
}
```

### Utilities: `audioUtils.js`

**File**: `client/src/utils/audioUtils.js`

Helper functions for mobile support and debugging:

- `playAudioSafely(audio)` - Safely play audio with promise handling
- `isMobileDevice()` - Detect mobile devices
- `canAutoplay()` - Check if browser allows autoplay
- `onFirstUserInteraction(callback)` - Register callback for first user interaction
- `getBrowserInfo()` - Get debugging information
- `logAudioError(error, context)` - Log audio errors to sessionStorage

### Component: `StickyPlayer`

**File**: `client/src/components/lesson/StickyPlayer.jsx`

Renders the audio player UI using the `useAudioPlayback` hook:

- Play/pause button with progress bar
- Volume control with mute button
- Speed selector (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Time display (current/total)
- Error message display
- Responsive design for mobile

### Integration: `Lessons.jsx`

**File**: `client/src/pages/app/Lessons.jsx`

Uses StickyPlayer to display audio for each question:

- Passes audio URL to StickyPlayer
- Auto-play triggered on question change
- Key prop ensures proper component remounting

## How It Works

### Auto-Play Flow

```
1. User navigates to new question
   ↓
2. Question index changes → lesson prop changes
   ↓
3. lesson.audio prop passed to StickyPlayer → src prop changes
   ↓
4. useAudioPlayback detects src change
   ↓
5. Old audio stops, new audio loads
   ↓
6. attemptAutoplay() tries to play automatically
   ↓
7. If blocked by browser:
   - On desktop: User can click play button (manual)
   - On mobile: Registers for first user interaction
   ↓
8. Once first interaction detected on mobile:
   - Automatic play enabled for subsequent questions
```

### Mobile Autoplay Policy Handling

Modern browsers restrict autoplay for:

- Unmuted audio without user interaction (security)
- Media Engagement Index-based (Chrome, Edge)
- Different policies per browser

**Our Solution**:

1. **Initial Attempt**: Try muted autoplay or full autoplay
2. **Detection**: If blocked, gracefully handle rejection
3. **Mobile Fallback**: Register listener for first user interaction (tap, click)
4. **Subsequent Play**: After first interaction, autoplay often becomes enabled

**Browser-Specific Behaviors**:

- **Chrome/Edge**: Media Engagement Index - improves with user interaction
- **Safari (iOS)**: Requires user interaction, but then mostly allows autoplay
- **Firefox**: Generally more lenient with autoplay
- **Android**: Varies by device and browser version

## Technical Implementation Details

### Promise-Based Play Handling

```javascript
// Old (doesn't work on mobile)
audio.play(); // Returns undefined on older browsers

// New (mobile compatible)
const playPromise = audio.play();
if (playPromise !== undefined) {
  await playPromise; // Handle promise
}
```

### CORS Configuration

```javascript
const audio = new Audio();
audio.crossOrigin = "anonymous"; // Allow cross-origin audio
audio.preload = "metadata"; // Load metadata only
```

### Resource Cleanup

- Audio paused when src changes
- currentTime reset to 0
- Event listeners properly removed on unmount
- Refs reset to prevent stale closures

## Debugging

### Check Audio Errors

Browser DevTools Console:

```javascript
// View stored audio errors
JSON.parse(sessionStorage.getItem("audioErrors"));

// Get browser info
console.log(window.__audioDebug__);
```

### Common Issues & Solutions

| Issue                            | Cause                    | Solution                                |
| -------------------------------- | ------------------------ | --------------------------------------- |
| No auto-play on desktop          | Browser policy           | User clicks play button (normal)        |
| No auto-play on mobile           | Media Engagement Index   | User taps play or waits for interaction |
| Audio not loading                | CORS or invalid URL      | Check audio URL in network tab          |
| Multiple audios playing          | Race condition           | Fixed with src change cleanup           |
| Audio continues after navigation | Incomplete cleanup       | Fixed with improved useEffect           |
| Volume not persisting            | State reset per question | Expected behavior (resets per question) |

### Network Debugging

DevTools → Network tab → Filter by media:

- Check audio file loads successfully (200 status)
- Verify Content-Type is audio/\* or application/octet-stream
- Check CORS headers if cross-origin

## Browser Compatibility

### Desktop ✓

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Mobile ✓

- iOS Safari 14+
- Android Chrome 88+
- Samsung Internet 14+
- Firefox Mobile 87+

## Performance Considerations

1. **Preload Strategy**: Uses `preload="metadata"` to reduce bandwidth
2. **Audio Instance**: Single Audio() element per question (not per player)
3. **Event Listeners**: Cleaned up properly to prevent memory leaks
4. **CORS**: crossOrigin="anonymous" adds minimal overhead

## Future Improvements

1. **Audio Queue**: Pre-load next question audio while current plays
2. **Caching**: Cache audio blobs in IndexedDB for offline playback
3. **Metrics**: Track autoplay success/failure rates
4. **Offline Support**: Service Worker for cached audio playback
5. **Advanced Controls**: Playback rate persistence, bookmarks

## Testing Checklist

- [ ] Desktop: Auto-play on question change
- [ ] Desktop: Manual play works
- [ ] Desktop: Speed controls work
- [ ] Desktop: Volume controls work
- [ ] Desktop: Audio stops on navigation
- [ ] Mobile (iOS): Manual play works on first question
- [ ] Mobile (iOS): Auto-play after first interaction
- [ ] Mobile (Android): Same as iOS
- [ ] Android: Works on Chrome, Samsung Internet
- [ ] iOS: Works on Safari
- [ ] Check no multiple audios playing
- [ ] Check proper cleanup on unmount
- [ ] Test with slow network (DevTools throttling)
- [ ] Test with poor network (simulate failures)

## References

- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTMLAudioElement - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Autoplay Policy - Chrome Dev Docs](https://developer.chrome.com/blog/autoplay/)
- [Media Engagement Index - Chromium Docs](https://www.chromium.org/developers/design-documents/autoplay-policy)
