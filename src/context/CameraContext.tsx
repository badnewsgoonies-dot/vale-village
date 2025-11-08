import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CameraState {
  zoom: number; // 1.0 = normal, 2.0 = 2x zoom in, 0.5 = 2x zoom out
  position: { x: number; y: number }; // Camera center position
  shake: {
    intensity: number; // 0 = no shake, 1.0 = max shake
    duration: number; // milliseconds remaining
  };
  rotation: number; // Degrees (usually 0, but available for dramatic effects)
}

export interface CameraControls {
  // Basic camera controls
  setZoom: (zoom: number, duration?: number) => void;
  setPosition: (x: number, y: number, duration?: number) => void;

  // Convenience methods
  zoomTo: (zoom: number, duration?: number) => void;
  zoomIn: (amount?: number, duration?: number) => void;
  zoomOut: (amount?: number, duration?: number) => void;
  panTo: (x: number, y: number, duration?: number) => void;
  panBy: (dx: number, dy: number, duration?: number) => void;

  // Focus on a target
  focusOn: (target: { x: number; y: number }, options?: {
    zoom?: number;
    duration?: number;
    offset?: { x: number; y: number };
  }) => void;

  // Screen effects
  shake: (intensity?: 'light' | 'medium' | 'heavy' | number, duration?: number) => void;
  rotate: (degrees: number, duration?: number) => void;

  // Reset
  reset: (duration?: number) => void;
}

interface CameraContextValue {
  camera: CameraState;
  controls: CameraControls;
}

const CameraContext = createContext<CameraContextValue | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [camera, setCamera] = useState<CameraState>({
    zoom: 1.0,
    position: { x: 0, y: 0 },
    shake: { intensity: 0, duration: 0 },
    rotation: 0,
  });

  const [transitionDuration, setTransitionDuration] = useState(0);
  const shakeTimersRef = React.useRef<NodeJS.Timeout[]>([]);

  // Helper to animate camera properties
  const animateCamera = useCallback((
    updates: Partial<CameraState>,
    duration: number = 0
  ) => {
    setTransitionDuration(duration);
    setCamera(prev => ({ ...prev, ...updates }));

    // Reset transition duration after animation completes
    if (duration > 0) {
      setTimeout(() => setTransitionDuration(0), duration);
    }
  }, []);

  const controls: CameraControls = {
    setZoom: useCallback((zoom: number, duration = 0) => {
      animateCamera({ zoom: Math.max(0.1, Math.min(10, zoom)) }, duration);
    }, [animateCamera]),

    setPosition: useCallback((x: number, y: number, duration = 0) => {
      animateCamera({ position: { x, y } }, duration);
    }, [animateCamera]),

    zoomTo: useCallback((zoom: number, duration = 500) => {
      animateCamera({ zoom: Math.max(0.1, Math.min(10, zoom)) }, duration);
    }, [animateCamera]),

    zoomIn: useCallback((amount = 0.5, duration = 500) => {
      setCamera(prev => {
        const newZoom = Math.min(10, prev.zoom + amount);
        return { ...prev, zoom: newZoom };
      });
      setTransitionDuration(duration);
      if (duration > 0) {
        setTimeout(() => setTransitionDuration(0), duration);
      }
    }, []),

    zoomOut: useCallback((amount = 0.5, duration = 500) => {
      setCamera(prev => {
        const newZoom = Math.max(0.1, prev.zoom - amount);
        return { ...prev, zoom: newZoom };
      });
      setTransitionDuration(duration);
      if (duration > 0) {
        setTimeout(() => setTransitionDuration(0), duration);
      }
    }, []),

    panTo: useCallback((x: number, y: number, duration = 500) => {
      animateCamera({ position: { x, y } }, duration);
    }, [animateCamera]),

    panBy: useCallback((dx: number, dy: number, duration = 500) => {
      setCamera(prev => ({
        ...prev,
        position: { x: prev.position.x + dx, y: prev.position.y + dy }
      }));
      setTransitionDuration(duration);
      if (duration > 0) {
        setTimeout(() => setTransitionDuration(0), duration);
      }
    }, []),

    focusOn: useCallback((
      target: { x: number; y: number },
      options: {
        zoom?: number;
        duration?: number;
        offset?: { x: number; y: number };
      } = {}
    ) => {
      const { zoom, duration = 800, offset = { x: 0, y: 0 } } = options;

      const updates: Partial<CameraState> = {
        position: {
          x: target.x + offset.x,
          y: target.y + offset.y,
        },
      };

      if (zoom !== undefined) {
        updates.zoom = Math.max(0.1, Math.min(10, zoom));
      }

      animateCamera(updates, duration);
    }, [animateCamera]),

    shake: useCallback((
      intensity: 'light' | 'medium' | 'heavy' | number = 'medium',
      duration = 500
    ) => {
      // Clear any existing shake timers
      shakeTimersRef.current.forEach(timer => clearTimeout(timer));
      shakeTimersRef.current = [];

      const intensityMap = {
        light: 0.3,
        medium: 0.6,
        heavy: 1.0,
      };

      const shakeIntensity = typeof intensity === 'number'
        ? intensity
        : intensityMap[intensity];

      setCamera(prev => ({
        ...prev,
        shake: { intensity: shakeIntensity, duration },
      }));

      // Gradually reduce shake intensity
      const steps = 20;
      const stepDuration = duration / steps;

      for (let i = 1; i <= steps; i++) {
        const timer = setTimeout(() => {
          setCamera(prev => ({
            ...prev,
            shake: {
              intensity: shakeIntensity * (1 - i / steps),
              duration: duration - (stepDuration * i),
            },
          }));
        }, stepDuration * i);
        shakeTimersRef.current.push(timer);
      }
    }, []),

    rotate: useCallback((degrees: number, duration = 500) => {
      animateCamera({ rotation: degrees }, duration);
    }, [animateCamera]),

    reset: useCallback((duration = 500) => {
      animateCamera({
        zoom: 1.0,
        position: { x: 0, y: 0 },
        shake: { intensity: 0, duration: 0 },
        rotation: 0,
      }, duration);
    }, [animateCamera]),
  };

  // Cleanup shake timers on unmount
  React.useEffect(() => {
    return () => {
      shakeTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const shakeClass = camera.shake.intensity > 0 ? 'camera-shaking' : '';
  const shakeStyle = camera.shake.intensity > 0
    ? { '--shake-intensity': camera.shake.intensity } as React.CSSProperties
    : {};

  return (
    <CameraContext.Provider value={{ camera, controls }}>
      <div
        className={shakeClass}
        style={{
          transition: transitionDuration > 0
            ? `transform ${transitionDuration}ms ease-out`
            : 'none',
          transform: `
            translate(${camera.position.x}px, ${camera.position.y}px)
            scale(${camera.zoom})
            rotate(${camera.rotation}deg)
          `,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          ...shakeStyle,
        }}
      >
        {children}
      </div>
    </CameraContext.Provider>
  );
};

export const useCamera = (): CameraContextValue => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
