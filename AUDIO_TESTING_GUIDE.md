# Audio Playback Testing Guide

## Pre-Testing Checklist

- [ ] Application is deployed to HTTPS
- [ ] Audio files are on CORS-enabled server
- [ ] Browser DevTools is accessible for debugging
- [ ] Multiple devices/browsers available for testing

## Desktop Testing

### Chrome/Edge

```
Test Case 1: Auto-Play on First Question
1. Open application
2. Navigate to a topic with lessons
3. First question should display with audio player
4. After 0.5-1 second, audio should auto-play
5. ✅ PASS if audio plays automatically

Test Case 2: Auto-Play on Question Change
1. While audio is playing, click "Next" button
2. New question loads
3. Previous audio stops
4. New audio should auto-play after 0.5-1 second
5. ✅ PASS if new audio auto-plays immediately

Test Case 3: Manual Play/Pause
1. Click play button to pause
2. Audio should pause immediately
3. Click play button again
4. Audio should resume from paused position
5. ✅ PASS if play/pause work without lag

Test Case 4: Volume Control
1. Move volume slider all the way left (0)
2. Audio should have no sound
3. Move volume slider to middle (0.5)
4. Audio volume should be half
5. Move volume slider all the way right (1)
6. Audio volume should be full
7. ✅ PASS if volume changes smoothly

Test Case 5: Mute Button
1. Click mute button
2. Audio should have no sound (should match mute icon)
3. Volume slider should show 0
4. Click mute button again
5. Audio should restore previous volume
6. ✅ PASS if mute/unmute works correctly

Test Case 6: Speed Control
1. Click speed dropdown (shows "1x")
2. Select 0.5x
3. Audio playback should be slow
4. Select 2x
5. Audio playback should be fast
6. Select 1x
7. Audio playback should be normal speed
8. ✅ PASS if all speeds work smoothly

Test Case 7: Progress Bar
1. Click on the progress bar at 50%
2. Audio should seek to 50% position
3. Click at 25%
4. Audio should seek to 25%
5. ✅ PASS if seeking works accurately

Test Case 8: Fast Navigation
1. Click "Next" button rapidly 3-4 times
2. Audio should stop from previous questions
3. Final question's audio should play
4. No multiple audios should play together
5. ✅ PASS if only current audio plays

Test Case 9: Error Handling
1. (Simulate by using DevTools to block audio requests)
2. Error message should appear in UI
3. Play button should remain clickable
4. ✅ PASS if error handled gracefully
```

### Firefox

Repeat all Chrome tests - Firefox should behave identically

### Safari (Desktop/macOS)

Repeat all Chrome tests - Safari has slightly different autoplay policy but should work

---

## Mobile Testing - iOS

### Setup

- Device: iPhone or iPad
- Browser: Safari (native)
- Network: WiFi (for initial testing)
- DevTools: Use Safari Remote Debugging if needed

### Test Cases

```
Test Case 1: First Question - Manual Play Required
1. Open application in Safari on iPad/iPhone
2. Navigate to lesson with audio
3. Audio should NOT auto-play (iOS policy)
4. Tap the play button
5. Audio should start playing
6. ✅ PASS if manual play works

Test Case 2: Auto-Play After First Interaction
1. Complete Test Case 1 (tap play once)
2. Click "Next" to go to next question
3. Audio should auto-play automatically
4. Tap "Next" again
5. Audio should auto-play for this question too
6. ✅ PASS if auto-play works after first interaction

Test Case 3: Volume Control (Speaker)
1. Using device speaker (not headphones)
2. Adjust volume slider to quiet
3. Audio volume should decrease
4. Adjust to loud
5. Audio volume should increase
6. ✅ PASS if volume control works

Test Case 4: Volume Control (Headphones)
1. Connect headphones
2. Audio should play through headphones
3. Adjust volume slider
4. Volume should change in headphones
5. ✅ PASS if headphone volume works

Test Case 5: Portrait to Landscape Rotation
1. While audio is playing in portrait
2. Rotate device to landscape
3. Audio should continue playing without interruption
4. Player UI should adapt to landscape
5. ✅ PASS if rotation doesn't interrupt playback

Test Case 6: Background App
1. Start audio playback
2. Press home button
3. Switch to another app
4. Audio may continue or stop (varies by iOS version)
5. Switch back to app
6. Audio should resume or be pausable
7. ✅ PASS if app recovers properly

Test Case 7: Network Change (WiFi → Cellular)
1. Start on WiFi with audio playing
2. Disable WiFi (phone will switch to cellular)
3. Audio should attempt to continue
4. If stops, user should be able to retry
5. ✅ PASS if handles network change

Test Case 8: Low Battery Mode
1. Enable Low Battery Mode
2. Audio playback should work normally
3. No additional restrictions
4. ✅ PASS if works with Low Battery Mode
```

---

## Mobile Testing - Android

### Setup

- Device: Android phone or tablet
- Browser: Chrome (primary), Samsung Internet (if available)
- Network: WiFi (for initial testing)
- DevTools: Use Chrome Remote Debugging

### Test Cases

```
Test Case 1: Auto-Play on Load
1. Open application in Chrome on Android
2. Navigate to lesson with audio
3. Audio should auto-play immediately
4. ✅ PASS if auto-play works on Android

Test Case 2: Auto-Play on Navigation
1. Click "Next" to load new question
2. Previous audio stops
3. New audio auto-plays
4. ✅ PASS if navigation auto-play works

Test Case 3: Speed Control
1. Open speed menu
2. Select different speeds
3. Audio playback should match selected speed
4. ✅ PASS if speed works

Test Case 4: Volume Control (Speaker)
1. Adjust system volume with hardware buttons
2. Or use in-app volume slider
3. Audio volume should change
4. ✅ PASS if volume control works

Test Case 5: Screen Rotation
1. Audio playing in portrait
2. Rotate to landscape
3. Audio should continue without interruption
4. ✅ PASS if rotation doesn't interrupt

Test Case 6: Multiple Apps
1. Start audio playback
2. Open another app
3. Return to app
4. Audio should resume or be controllable
5. ✅ PASS if app handles multitasking

Test Case 7: Metered Connection
1. Switch to cellular/metered connection
2. Audio should continue or handle gracefully
3. No crashes or errors
4. ✅ PASS if handles metered connection

Test Case 8: Different Chrome Versions
1. Test on Chrome version matching your min requirement
2. Test on latest Chrome
3. Both should work
4. ✅ PASS if compatible
```

---

## Console Debugging

During testing, check console for:

```javascript
// No errors should appear
console.error; // Should be empty or only app-related

// Check for audio-specific issues
sessionStorage.getItem("audioErrors"); // Should be null or []

// Monitor audio events (if logging is enabled)
// play, pause, timeupdate, ended events should fire
```

---

## Network Throttling Tests

Chrome DevTools can simulate slow networks:

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Throttling" dropdown (likely set to "No Throttling")
4. Select "Slow 3G" or "Fast 3G"
5. Reload page
6. Test audio playback

Expected behavior:

- ✅ Audio loading indicator should show
- ✅ After loading, audio plays correctly
- ✅ Progress bar shows loading state
- ✅ No stuttering or skipping

---

## Error Scenario Tests

### Test 1: Invalid Audio URL

1. (Requires code modification temporarily)
2. Set audio URL to invalid path
3. Error message should display
4. Play button should remain clickable
5. Attempting to play should show error

### Test 2: CORS Error

1. Audio file on server without CORS headers
2. Error message should appear
3. Graceful error handling

### Test 3: Interrupted Connection

1. Start audio playback
2. (DevTools → Network → Offline)
3. Audio should stop gracefully
4. Error message may appear
5. User can retry when connection restored

---

## Accessibility Testing

```
Test Case: Keyboard Navigation
1. Open player
2. Tab to play button
3. Space/Enter should toggle play
4. Tab to volume slider
5. Arrow keys should adjust volume
6. ✅ PASS if keyboard navigation works

Test Case: Screen Reader (iOS VoiceOver)
1. Enable VoiceOver (Settings → Accessibility)
2. All buttons should be labeled
3. Volume and speed controls should be describable
4. ✅ PASS if screen reader can navigate
```

---

## Performance Testing

Using Chrome DevTools Performance Tab:

```
1. Open DevTools
2. Go to Performance tab
3. Record while navigating between questions
4. Stop recording
5. Check results:
   - ✅ No long tasks (>50ms)
   - ✅ Smooth frame rate (60fps)
   - ✅ Memory stable (no leaks)
   - ✅ Quick question transitions (<500ms)
```

---

## Memory Leak Testing

```javascript
// In DevTools Console:
1. Take heap snapshot (Performance tab)
2. Navigate to question with audio
3. Navigate away, navigate back
4. Take another heap snapshot
5. Compare snapshots
6. ✅ PASS if no memory increase
```

---

## Final Verification Checklist

Before deployment:

- [ ] Desktop: Chrome ✅
- [ ] Desktop: Firefox ✅
- [ ] Desktop: Safari ✅
- [ ] Desktop: Edge ✅
- [ ] Mobile: iOS Safari ✅
- [ ] Mobile: Android Chrome ✅
- [ ] Mobile: Samsung Internet ✅
- [ ] No console errors ✅
- [ ] No memory leaks ✅
- [ ] Fast navigation works ✅
- [ ] Error handling works ✅
- [ ] Accessibility checks pass ✅
- [ ] Network throttling tested ✅
- [ ] Rotation/orientation works ✅
- [ ] Background/foreground works ✅
- [ ] All controls functional ✅

---

## Test Report Template

```
Device: [Device Name/Model]
Browser: [Browser Name/Version]
OS: [Windows/macOS/iOS/Android] Version [X.X]
Network: [WiFi/Cellular/Throttled]
Test Date: [Date]

Tests Passed: [X]/[Total]
Critical Issues: [List any]
Minor Issues: [List any]

Notes:
[Any additional observations]
```

---

## Continuous Testing

Regular testing schedule:

- **Weekly**: Full desktop testing (all browsers)
- **Bi-weekly**: Mobile testing (iOS + Android)
- **Monthly**: Extended testing (slow network, errors, edge cases)
- **Per Release**: Full regression testing
