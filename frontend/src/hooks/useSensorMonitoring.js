import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for monitoring device sensors in real-time
 * Handles accelerometer, gyroscope, GPS, device motion, and activity tracking
 */
export const useSensorMonitoring = (enabled = false) => {
  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0, y: 0, z: 0, magnitude: 0 },
    gyroscope: { x: 0, y: 0, z: 0, magnitude: 0 },
    gps: { latitude: null, longitude: null, speed: 0, accuracy: null },
    motion: { acceleration: 0, rotationRate: 0 },
    activity: { isMoving: false, lastMovement: null, inactivityDuration: 0 }
  });

  const [sensorStatus, setSensorStatus] = useState({
    accelerometer: 'inactive',
    gyroscope: 'inactive',
    gps: 'inactive',
    motion: 'inactive'
  });

  const lastActivityRef = useRef(Date.now());
  const gpsWatchIdRef = useRef(null);
  const motionIntervalRef = useRef(null);

  // Monitor accelerometer
  useEffect(() => {
    if (!enabled) return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (acc) {
        const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        setSensorData(prev => ({
          ...prev,
          accelerometer: { x: acc.x, y: acc.y, z: acc.z, magnitude }
        }));
        setSensorStatus(prev => ({ ...prev, accelerometer: 'active' }));
        lastActivityRef.current = Date.now();
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [enabled]);

  // Monitor gyroscope (device orientation)
  useEffect(() => {
    if (!enabled) return;

    const handleOrientation = (event) => {
      const magnitude = Math.sqrt(
        (event.alpha || 0) ** 2 + 
        (event.beta || 0) ** 2 + 
        (event.gamma || 0) ** 2
      );
      setSensorData(prev => ({
        ...prev,
        gyroscope: { x: event.alpha || 0, y: event.beta || 0, z: event.gamma || 0, magnitude }
      }));
      setSensorStatus(prev => ({ ...prev, gyroscope: 'active' }));
      lastActivityRef.current = Date.now();
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [enabled]);

  // Monitor GPS
  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setSensorStatus(prev => ({ ...prev, gps: 'unsupported' }));
      return;
    }

    const handlePosition = (position) => {
      setSensorData(prev => ({
        ...prev,
        gps: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy
        }
      }));
      setSensorStatus(prev => ({ ...prev, gps: 'active' }));
      lastActivityRef.current = Date.now();
    };

    const handleError = (error) => {
      setSensorStatus(prev => ({ ...prev, gps: 'error' }));
    };

    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => {
      if (gpsWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      }
    };
  }, [enabled]);

  // Monitor activity and inactivity
  useEffect(() => {
    if (!enabled) return;

    motionIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const inactivityDuration = (now - lastActivityRef.current) / 1000; // seconds
      
      setSensorData(prev => ({
        ...prev,
        activity: {
          isMoving: inactivityDuration < 5,
          lastMovement: lastActivityRef.current,
          inactivityDuration
        }
      }));

      // Update motion status based on accelerometer
      setSensorData(prev => ({
        ...prev,
        motion: {
          acceleration: prev.accelerometer.magnitude,
          rotationRate: prev.gyroscope.magnitude
        }
      }));
    }, 1000);

    return () => {
      if (motionIntervalRef.current) {
        clearInterval(motionIntervalRef.current);
      }
    };
  }, [enabled]);

  // Cleanup on disable
  useEffect(() => {
    if (!enabled) {
      setSensorStatus({
        accelerometer: 'inactive',
        gyroscope: 'inactive',
        gps: 'inactive',
        motion: 'inactive'
      });
    }
  }, [enabled]);

  return { sensorData, sensorStatus };
};
