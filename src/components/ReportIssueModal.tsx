import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Bug,
  BookOpen,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Feather,
  Shield,
  Star,
  GitPullRequest
} from 'lucide-react';
import {
  GITHUB_REPO_URL,
  GITHUB_ISSUES_URL,
  GITHUB_NEW_ISSUE_URL,
  GITHUB_BUG_REPORT_URL,
  GITHUB_LORE_REPORT_URL,
  GITHUB_FEATURE_REQUEST_URL,
  GITHUB_SECURITY_POLICY_URL
} from '../data/github';

export interface RouteTelemetrySummary {
  originName: string;
  destinationName: string;
  partyName: string;
  mode: string;
  miles: number;
  days: number;
  waypointsCount?: number;
  waypointsSummary?: string;
}

export interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeTelemetry?: RouteTelemetrySummary | null;
}

/**
 * Official GitHub Octocat SVG icon.
 */
export const GithubIcon: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 16,
  className,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  routeTelemetry
}) => {
  const [hasCopiedTelemetry, setHasCopiedTelemetry] = useState(false);

  // Keyboard navigation (Esc to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyTelemetry = useCallback(async () => {
    if (!routeTelemetry) return;
    const text = [
      `### Journey Telemetry:`,
      `- Departure: ${routeTelemetry.originName}`,
      `- Arrival: ${routeTelemetry.destinationName}`,
      `- Travel Party: ${routeTelemetry.partyName}`,
      `- Corridor Mode: ${routeTelemetry.mode}`,
      `- Distance: ${Math.round(routeTelemetry.miles).toLocaleString()} miles`,
      `- Transit Time: ${routeTelemetry.days.toFixed(1)} days`,
      routeTelemetry.waypointsSummary ? `- Stops: ${routeTelemetry.waypointsSummary}` : '',
      `- URL: ${typeof window !== 'undefined' ? window.location.href : ''}`
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setHasCopiedTelemetry(true);
      setTimeout(() => setHasCopiedTelemetry(false), 2400);
    } catch {
      // Fallback
    }
  }, [routeTelemetry]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="citadel-modal-backdrop"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="citadel-report-title"
    >
      <div
        className="glass-panel citadel-modal-dialog citadel-report-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="citadel-report-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="citadel-brand-crest" style={{ width: 36, height: 36 }}>
              <Feather size={19} color="var(--bg-primary, #0a0e14)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2
                  id="citadel-report-title"
                  className="font-serif"
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    letterSpacing: '1px',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Send a Raven to the Citadel
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(223, 177, 91, 0.2)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--text-gold-bright)',
                    fontWeight: 700,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 0.5
                  }}
                >
                  GITHUB ISSUES
                </span>
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  letterSpacing: '0.2px'
                }}
              >
                Report bugs, suggest canonical lore corrections, or contribute to The Known World Navigator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close (Esc)"
            className="citadel-modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="citadel-report-body">
          {/* Active Route Telemetry Card (if available) */}
          {routeTelemetry && (
            <div className="citadel-report-context-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13 }}>📍</span>
                  <strong style={{ fontSize: 12.5, color: 'var(--text-gold-bright)', fontFamily: "'Cinzel', serif" }}>
                    Active Journey Context Detected
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTelemetry}
                  className="citadel-report-copy-btn"
                  title="Copy journey details to include in your GitHub issue"
                >
                  {hasCopiedTelemetry ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                  <span>{hasCopiedTelemetry ? 'Copied Telemetry!' : 'Copy Telemetry for Issue'}</span>
                </button>
              </div>

              <div className="citadel-report-context-grid">
                <div>
                  <span className="citadel-report-label">Path</span>
                  <strong>{routeTelemetry.originName} &rarr; {routeTelemetry.destinationName}</strong>
                </div>
                <div>
                  <span className="citadel-report-label">Party & Mode</span>
                  <span>{routeTelemetry.partyName} ({routeTelemetry.mode.replace('_', ' ')})</span>
                </div>
                <div>
                  <span className="citadel-report-label">Scale Telemetry</span>
                  <span>{Math.round(routeTelemetry.miles).toLocaleString()} mi • {routeTelemetry.days.toFixed(1)} days</span>
                </div>
              </div>
            </div>
          )}

          {/* Issue Categories Grid */}
          <div className="citadel-report-section-title font-serif">
            Choose Issue Category
          </div>

          <div className="citadel-report-cards-grid">
            {/* Category 1: Bug Report */}
            <a
              href={GITHUB_BUG_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="citadel-report-card"
            >
              <div className="citadel-report-card-icon bug">
                <Bug size={20} />
              </div>
              <div className="citadel-report-card-content">
                <div className="citadel-report-card-header">
                  <h3 className="font-serif">Cartographic or Route Bug</h3>
                  <ExternalLink size={14} className="citadel-report-card-arrow" />
                </div>
                <p>
                  Found an impossible route, land-clipping shipping lane, hairpin reversal, rendering glitch, or UI error.
                </p>
                <span className="citadel-report-card-action">
                  Open Bug Report Form &rarr;
                </span>
              </div>
            </a>

            {/* Category 2: Lore Correction */}
            <a
              href={GITHUB_LORE_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="citadel-report-card"
            >
              <div className="citadel-report-card-icon lore">
                <BookOpen size={20} />
              </div>
              <div className="citadel-report-card-content">
                <div className="citadel-report-card-header">
                  <h3 className="font-serif">Lore or Geography Correction</h3>
                  <ExternalLink size={14} className="citadel-report-card-arrow" />
                </div>
                <p>
                  Spotted an inaccurate castle placement, wrong noble house allegiance, battle commander discrepancy, or spelling errata.
                </p>
                <span className="citadel-report-card-action">
                  Submit Lore Correction Form &rarr;
                </span>
              </div>
            </a>

            {/* Category 3: Feature Request */}
            <a
              href={GITHUB_FEATURE_REQUEST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="citadel-report-card"
            >
              <div className="citadel-report-card-icon feature">
                <Sparkles size={20} />
              </div>
              <div className="citadel-report-card-content">
                <div className="citadel-report-card-header">
                  <h3 className="font-serif">Feature or Journey Proposal</h3>
                  <ExternalLink size={14} className="citadel-report-card-arrow" />
                </div>
                <p>
                  Suggest a historical journey preset, new travel party archetype, additional cartography layer, or tool enhancement.
                </p>
                <span className="citadel-report-card-action">
                  Propose Feature Form &rarr;
                </span>
              </div>
            </a>
          </div>

          {/* Repository & Open Source Archive Card */}
          <div className="citadel-report-archive-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <GithubIcon size={20} />
              <strong className="font-serif" style={{ fontSize: 14, color: 'var(--text-gold-bright)' }}>
                GitHub Repository & Citadel Archives
              </strong>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-parchment)', lineHeight: 1.5, margin: '0 0 12px' }}>
              The project is 100% open-source under the MIT License. Contributions, pull requests, and feedback are welcomed by the Citadel cartographers.
            </p>

            <div className="citadel-report-links-row">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="citadel-report-sublink"
              >
                <GithubIcon size={14} />
                <span>garcejan/got-map-explorer</span>
              </a>

              <a
                href={GITHUB_ISSUES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="citadel-report-sublink"
              >
                <GitPullRequest size={14} />
                <span>Browse All Open Issues</span>
              </a>

              <a
                href={GITHUB_SECURITY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="citadel-report-sublink"
              >
                <Shield size={14} />
                <span>Security Policy</span>
              </a>

              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="citadel-report-sublink"
              >
                <Star size={14} />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="citadel-report-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-dim)' }}>
            <span>Archmaester Repository</span>
            <span>•</span>
            <a
              href={GITHUB_NEW_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-gold)', textDecoration: 'underline' }}
            >
              Direct Issue Chooser
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-citadel"
              style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <GithubIcon size={14} />
              <span>Visit Repository</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="btn-citadel-inverse"
              style={{ padding: '8px 16px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReportIssueModal;
