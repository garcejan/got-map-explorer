import React, { useState, useEffect, useRef } from 'react';
import {
  Mouse,
  Compass,
  Move,
  ZoomIn,
  ChevronDown,
  ChevronUp,
  MousePointer
} from 'lucide-react';
import type { Theme } from './Header';

interface CitadelMouseGuideProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  isCustomCursorActive: boolean;
  onToggleCustomCursor: () => void;
  theme: Theme;
}

export const CitadelMouseGuide: React.FC<CitadelMouseGuideProps> = ({
  isOpen,
  onToggleOpen,
  isCustomCursorActive,
  onToggleCustomCursor,
  theme
}) => {
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);
  const [isWheelActive, setIsWheelActive] = useState(false);
  const [liveAction, setLiveAction] = useState<'idle' | 'panning' | 'zooming'>('idle');

  const wheelTimeoutRef = useRef<number | null>(null);
  const actionTimeoutRef = useRef<number | null>(null);

  // Global listeners for mouse interactions to illuminate the hovering Citadel mouse
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsLeftActive(true);
        setLiveAction('panning');
      } else if (e.button === 2) {
        setIsRightActive(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsLeftActive(false);
      } else if (e.button === 2) {
        setIsRightActive(false);
      }

      if (actionTimeoutRef.current) {
        window.clearTimeout(actionTimeoutRef.current);
      }
      actionTimeoutRef.current = window.setTimeout(() => {
        setLiveAction('idle');
      }, 500);
    };

    const handleWheel = () => {
      setIsWheelActive(true);
      setLiveAction('zooming');

      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      wheelTimeoutRef.current = window.setTimeout(() => {
        setIsWheelActive(false);
      }, 350);

      if (actionTimeoutRef.current) {
        window.clearTimeout(actionTimeoutRef.current);
      }
      actionTimeoutRef.current = window.setTimeout(() => {
        setLiveAction('idle');
      }, 700);
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
      if (actionTimeoutRef.current) window.clearTimeout(actionTimeoutRef.current);
    };
  }, []);

  const isDark = theme === 'dark';
  const bodyFill = isDark ? '#141c26' : '#ede2d1';
  const goldBorder = isDark ? '#c99738' : '#b3802b';
  const goldBright = isDark ? '#ffd700' : '#855513';
  const buttonNormalFill = isDark ? '#1a2330' : '#dfd2bf';
  const leftFill = isLeftActive ? '#f59e0b' : buttonNormalFill;
  const rightFill = isRightActive ? '#38bdf8' : buttonNormalFill;
  const wheelFill = isWheelActive ? goldBright : (isDark ? '#e2b35b' : '#9a6b24');

  // Render the Citadel Astrolabe Computer Mouse SVG
  const renderCitadelMouseSVG = (width: number, height: number) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 54 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="citadel-mouse-svg"
      aria-hidden="true"
    >
      <defs>
        {/* Metallic outer rim gradient */}
        <linearGradient id="citadelMouseRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={goldBright} />
          <stop offset="50%" stopColor={goldBorder} />
          <stop offset="100%" stopColor="#784f17" />
        </linearGradient>

        {/* Wheel Glow Filter */}
        <filter id="goldWheelGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Mouse Body Outer Shell */}
      <path
        d="M27 2C13 2 4 15 4 32C4 50 11 82 27 82C43 82 50 50 50 32C50 15 41 2 27 2Z"
        fill={bodyFill}
        stroke="url(#citadelMouseRim)"
        strokeWidth="2.5"
      />

      {/* Top Left Click Button */}
      <path
        d="M6 31C6 17.5 13.5 4.5 25 4V31H6Z"
        fill={leftFill}
        stroke={goldBorder}
        strokeWidth="1.2"
        style={{ transition: 'fill 0.12s ease' }}
      />

      {/* Top Right Click Button */}
      <path
        d="M48 31C48 17.5 40.5 4.5 29 4V31H48Z"
        fill={rightFill}
        stroke={goldBorder}
        strokeWidth="1.2"
        style={{ transition: 'fill 0.12s ease' }}
      />

      {/* Center Wheel Cavity */}
      <rect
        x="23"
        y="10"
        width="8"
        height="18"
        rx="4"
        fill={isDark ? '#0b0f14' : '#c4b59f'}
        stroke={goldBorder}
        strokeWidth="1"
      />

      {/* Citadel Astrolabe Scroll Wheel */}
      <rect
        x="24.5"
        y="12"
        width="5"
        height="14"
        rx="2.5"
        fill={wheelFill}
        filter={isWheelActive ? 'url(#goldWheelGlow)' : undefined}
        className={isWheelActive ? 'citadel-wheel-active' : undefined}
        style={{ transition: 'fill 0.15s ease' }}
      />
      {/* Scroll wheel ridge marks */}
      <line x1="24.5" y1="15" x2="29.5" y2="15" stroke={isDark ? '#0a0e14' : '#5c3e12'} strokeWidth="1" />
      <line x1="24.5" y1="19" x2="29.5" y2="19" stroke={isDark ? '#0a0e14' : '#5c3e12'} strokeWidth="1" />
      <line x1="24.5" y1="23" x2="29.5" y2="23" stroke={isDark ? '#0a0e14' : '#5c3e12'} strokeWidth="1" />

      {/* Lower Palm Astrolabe / Compass Engraving */}
      <g opacity={isDark ? 0.65 : 0.8}>
        {/* Outer astrolabe ring */}
        <circle cx="27" cy="56" r="14" stroke={goldBorder} strokeWidth="1" strokeDasharray="3 2" />
        {/* Inner ring */}
        <circle cx="27" cy="56" r="8" stroke={goldBorder} strokeWidth="0.8" />
        {/* Cardinal Cross */}
        <line x1="27" y1="40" x2="27" y2="72" stroke={goldBorder} strokeWidth="0.8" />
        <line x1="11" y1="56" x2="43" y2="56" stroke={goldBorder} strokeWidth="0.8" />
        {/* Compass Diamond Star */}
        <polygon
          points="27,48 29.5,56 27,64 24.5,56"
          fill={goldBorder}
          opacity="0.9"
        />
        <polygon
          points="19,56 27,58.5 35,56 27,53.5"
          fill={goldBorder}
          opacity="0.9"
        />
        {/* Central Astrolabe Gem */}
        <circle cx="27" cy="56" r="2" fill={goldBright} />
      </g>
    </svg>
  );

  return (
    <div
      className="citadel-mouse-guide-dock"
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {/* 1. Minimized / Floating Badge View */}
      {!isOpen ? (
        <div
          className="citadel-mouse-floating"
          onClick={onToggleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleOpen();
            }
          }}
          title="Citadel Mouse & Navigation Guide — Click to expand"
          aria-label="Open Citadel Mouse Navigation Controls"
        >
          <div className="citadel-mouse-badge">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderCitadelMouseSVG(22, 34)}
            </div>
            <div className="citadel-mouse-badge-label">
              <span>Citadel Mouse</span>
              <span className="citadel-mouse-badge-sub">
                {liveAction === 'zooming' && 'Zooming...'}
                {liveAction === 'panning' && 'Panning...'}
                {liveAction === 'idle' && 'Click for Controls'}
              </span>
            </div>
            <ChevronUp size={14} color="var(--text-gold)" style={{ marginLeft: 2 }} />
          </div>
        </div>
      ) : (
        /* 2. Expanded Guidance Card */
        <div className="citadel-mouse-card" role="region" aria-label="Citadel Mouse Navigation Guide">
          {/* Card Header */}
          <div className="citadel-mouse-card-header">
            <div className="citadel-mouse-card-title">
              <Compass size={15} color="var(--text-gold)" />
              <span>Cartographer&apos;s Mouse</span>
            </div>
            <button
              type="button"
              onClick={onToggleOpen}
              className="citadel-mouse-card-close"
              title="Minimize guide"
              aria-label="Minimize Mouse Guide"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Illustrated Mouse & Live State Display */}
          <div className="citadel-mouse-visual-container">
            <div className="citadel-mouse-floating">
              {renderCitadelMouseSVG(40, 62)}
            </div>
            <div className="citadel-mouse-live-status">
              <div
                className={`citadel-mouse-status-pill ${liveAction === 'panning' ? 'active' : ''}`}
              >
                <Move size={11} />
                <span>{isLeftActive ? 'Left Click: Pan' : 'Drag to Pan'}</span>
              </div>
              <div
                className={`citadel-mouse-status-pill ${liveAction === 'zooming' ? 'active' : ''}`}
              >
                <ZoomIn size={11} />
                <span>{isWheelActive ? 'Scrolling Zoom' : 'Wheel to Zoom'}</span>
              </div>
              <div
                className={`citadel-mouse-status-pill ${isRightActive ? 'active' : ''}`}
              >
                <Mouse size={11} />
                <span>{isRightActive ? 'Right Click' : 'Hover Coordinates'}</span>
              </div>
            </div>
          </div>

          {/* Quick Legend List */}
          <div className="citadel-mouse-controls-list">
            <div className="citadel-mouse-control-row">
              <div className={`citadel-mouse-key-badge ${isLeftActive ? 'highlight' : ''}`}>L</div>
              <div>
                <strong style={{ color: 'var(--text-gold)' }}>Click & Drag</strong>: Pan across Westeros & Essos
              </div>
            </div>
            <div className="citadel-mouse-control-row">
              <div className={`citadel-mouse-key-badge ${isWheelActive ? 'highlight' : ''}`}>W</div>
              <div>
                <strong style={{ color: 'var(--text-gold)' }}>Scroll Wheel</strong>: Zoom in and out seamlessly
              </div>
            </div>
            <div className="citadel-mouse-control-row">
              <div className="citadel-mouse-key-badge">🎯</div>
              <div>
                <strong style={{ color: 'var(--text-gold)' }}>Click Stronghold</strong>: Select city, view lore dossier
              </div>
            </div>
          </div>

          {/* Card Footer: Cursor Toggle & Close */}
          <div className="citadel-mouse-card-footer">
            <button
              type="button"
              onClick={onToggleCustomCursor}
              className={`citadel-cursor-toggle-btn ${isCustomCursorActive ? 'active' : ''}`}
              title="Toggle Archmaester custom gold cursor & follower"
            >
              <MousePointer size={12} />
              <span>{isCustomCursorActive ? 'Custom Cursor: On' : 'Custom Cursor: Off'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleOpen}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: 11,
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              Hide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
