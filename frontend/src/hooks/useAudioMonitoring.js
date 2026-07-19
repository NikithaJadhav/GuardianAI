import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for monitoring audio input for distress detection
 * Handles microphone access, sound level monitoring, and scream detection
 */
export const useAudioMonitoring = (enabled = false) => {
  const [audioData, setAudioData] = useState({
    isListening: false,
    currentLevel: 0,
    averageLevel: 0,
    peakLevel: 0,
    distressDetected: false,
    distressCount: 0
  });

  const [audioStatus, setAudioStatus] = useState('inactive');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const levelHistoryRef = useRef([]);
  const distressKeywordsRef = useRef(['HELP', 'SAVE ME', 'STOP', 'FIRE', 'ACCIDENT', 'EMERGENCY']);

  // Start audio monitoring
  const startMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      microphoneRef.current.connect(analyserRef.current);
      
      setAudioStatus('active');
      setAudioData(prev => ({ ...prev, isListening: true }));
      
      analyzeAudio();
    } catch (error) {
      console.error('Audio monitoring error:', error);
      setAudioStatus('error');
      setAudioData(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  // Stop audio monitoring
  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setAudioStatus('inactive');
    setAudioData(prev => ({ ...prev, isListening: false, currentLevel: 0 }));
  }, []);

  // Analyze audio levels
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const normalizedLevel = (average / 255) * 100;

    // Update level history for smoothing
    levelHistoryRef.current.push(normalizedLevel);
    if (levelHistoryRef.current.length > 50) {
      levelHistoryRef.current.shift();
    }

    const smoothedLevel = levelHistoryRef.current.reduce((a, b) => a + b, 0) / levelHistoryRef.current.length;
    const peakLevel = Math.max(...levelHistoryRef.current);

    // Detect distress (sudden loud sounds or sustained high volume)
    const distressThreshold = 70; // 70% of max volume
    const suddenIncrease = normalizedLevel > smoothedLevel * 2 && normalizedLevel > 50;
    const sustainedLoud = smoothedLevel > distressThreshold;
    
    const distressDetected = suddenIncrease || sustainedLoud;

    setAudioData(prev => ({
      ...prev,
      currentLevel: normalizedLevel,
      averageLevel: smoothedLevel,
      peakLevel,
      distressDetected,
      distressCount: distressDetected ? prev.distressCount + 1 : prev.distressCount
    }));

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  // Toggle monitoring based on enabled state
  useEffect(() => {
    if (enabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [enabled, startMonitoring, stopMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return { audioData, audioStatus };
};
