/**
 * GestureController
 *
 * UI overlay for gesture-based 3D rotation control.
 * Renders a toggle button and (when active) a mirrored webcam preview
 * with dead-zone indicator and real-time palm position dot.
 */

import React from 'react';

interface Props {
  isModelReady: boolean;
  isEnabled: boolean;
  isActive: boolean;
  hasError: boolean;
  onToggle: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  palmPos: { x: number; y: number } | null;
  deadZone: number;
}

// Simple hand SVG icon (no external icon lib needed)
const HandIcon: React.FC = () => (
  <svg
    width="16" height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 11V6a2 2 0 0 0-4 0" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

export const GestureController: React.FC<Props> = ({
  isModelReady,
  isEnabled,
  isActive,
  hasError,
  onToggle,
  videoRef,
  palmPos,
  deadZone,
}) => {
  const isDisabled = !isModelReady || hasError;

  const buttonLabel = hasError
    ? 'Error'
    : !isModelReady
      ? 'Loading...'
      : isActive
        ? 'Gesture ON'
        : 'Gesture';

  return (
    <>
      {/* Toggle button — top-right, mirroring the Back button on top-left */}
      <button
        onClick={onToggle}
        disabled={isDisabled}
        title={
          isEnabled
            ? 'Disable gesture control'
            : 'Enable gesture control (webcam required)'
        }
        style={{
          position: 'absolute',
          top: '45px',
          right: '15px',
          zIndex: 100,
          backgroundColor: isActive
            ? 'rgba(0, 80, 160, 0.9)'
            : 'rgba(10, 20, 30, 0.85)',
          border: `1px solid ${isActive ? '#64c8ff' : 'rgba(100, 200, 255, 0.3)'}`,
          color: hasError ? '#ff6464' : '#64c8ff',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          opacity: isDisabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        <HandIcon />
        <span>{buttonLabel}</span>
      </button>

      {/* Camera preview — only mounted when gesture is enabled */}
      {isEnabled && (
        <div
          style={{
            position: 'absolute',
            top: '100px',
            right: '15px',
            zIndex: 100,
            width: '160px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(100, 200, 255, 0.4)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            backgroundColor: '#000',
          }}
        >
          {/* Mirrored webcam feed (natural selfie view) */}
          <video
            ref={videoRef}
            style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }}
            muted
            playsInline
          />

          {/* Overlay: dead-zone box + palm dot */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* Yellow dashed dead-zone rectangle centered in preview */}
            <div
              style={{
                position: 'absolute',
                left: `${(0.5 - deadZone) * 100}%`,
                top: `${(0.5 - deadZone) * 100}%`,
                width: `${deadZone * 200}%`,
                height: `${deadZone * 200}%`,
                border: '1px dashed rgba(255, 220, 50, 0.85)',
                boxSizing: 'border-box',
              }}
            />

            {/* Blue glowing dot showing real-time palm position.
                Mirror x because the video display is scaleX(-1). */}
            {palmPos && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(1 - palmPos.x) * 100}%`,
                  top: `${palmPos.y * 100}%`,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#64c8ff',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px #64c8ff',
                }}
              />
            )}
          </div>

          {/* Status bar at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '4px',
              background: 'rgba(0,0,0,0.7)',
              color: palmPos ? '#64c8ff' : '#888',
              fontSize: '10px',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}
          >
            {palmPos ? 'Hand detected' : 'Show your palm'}
          </div>
        </div>
      )}
    </>
  );
};
