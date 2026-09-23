import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Compass, MapPin, Navigation, Anchor, Shield, Crown, Building2, ExternalLink } from 'lucide-react';
import { NODES } from '../data/nodes';
import type { LocationNode, NodeType } from '../types';

interface CitySearchProps {
  onSelectCity: (nodeId: string) => void;
  onSetOrigin?: (nodeId: string) => void;
  onSetDestination?: (nodeId: string) => void;
}

const FEATURED_CITY_IDS = [
  'kings_landing',
  'winterfell',
  'braavos',
  'oldtown',
  'meereen',
  'castle_black',
  'sunspear',
  'casterly_rock'
];

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  onSetOrigin,
  onSetDestination
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState<'all' | 'capital' | 'major_city' | 'port' | 'castle'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global shortcut to focus search: Cmd+K, Ctrl+K or '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (
        (modifier && e.key.toLowerCase() === 'k') ||
        (e.key === '/' &&
          document.activeElement !== inputRef.current &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || ''))
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter and score matching cities
  const filteredNodes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const allNodes = Object.values(NODES);

    let list: LocationNode[] = [];

    if (!trimmed) {
      if (typeFilter === 'all') {
        const featured = FEATURED_CITY_IDS.map((id) => NODES[id]).filter(Boolean);
        const featuredSet = new Set(FEATURED_CITY_IDS);
        const others = allNodes
          .filter((n) => !featuredSet.has(n.id))
          .sort((a, b) => a.name.localeCompare(b.name));
        list = [...featured, ...others];
      } else {
        list = allNodes
          .filter((node) => {
            if (typeFilter === 'port') return node.isPort || node.type === 'port';
            return node.type === typeFilter;
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      }
      return list;
    } else {
      const scored = allNodes.map((node) => {
        let score = 0;
        const nameLower = node.name.toLowerCase();
        const snippetLower = (node.loreSnippet || '').toLowerCase();
        const regionLower = (node.region || '').toLowerCase();
        const allegianceLower = (node.allegiance || '').toLowerCase();
        const typeLower = node.type.toLowerCase();

        if (nameLower === trimmed) score += 100;
        else if (nameLower.startsWith(trimmed)) score += 60;
        else if (nameLower.includes(trimmed)) score += 40;

        if (snippetLower.includes(trimmed)) score += 25;
        if (allegianceLower.includes(trimmed)) score += 20;
        if (regionLower.includes(trimmed)) score += 15;
        if (typeLower.includes(trimmed)) score += 10;

        return { node, score };
      });

      list = scored
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.node);

      if (typeFilter !== 'all') {
        list = list.filter((node) => {
          if (typeFilter === 'port') return node.isPort || node.type === 'port';
          return node.type === typeFilter;
        });
      }

      return list.slice(0, 100);
    }
  }, [query, typeFilter]);

  // Keep selected index in valid range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, typeFilter]);

  // Scroll selected item into view in suggestions list
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const item = listRef.current.children[selectedIndex] as HTMLElement;
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (nodeId: string) => {
    const node = NODES[nodeId];
    if (node) {
      setQuery(node.name);
    }
    setIsOpen(false);
    onSelectCity(nodeId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredNodes.length > 0 ? (prev + 1) % filteredNodes.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredNodes.length > 0 ? (prev - 1 + filteredNodes.length) % filteredNodes.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNodes[selectedIndex]) {
        handleSelect(filteredNodes[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Helper to highlight matching query text in name and lore snippet
  const highlightMatch = (text?: string) => {
    if (!text) return null;
    const trimmed = query.trim();
    if (!trimmed) return <span>{text}</span>;

    const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmed.toLowerCase() ? (
            <span
              key={i}
              style={{
                color: 'var(--text-gold-bright)',
                fontWeight: 700,
                backgroundColor: 'rgba(223, 177, 91, 0.25)',
                borderRadius: 2,
                padding: '0 2px'
              }}
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getTypeIcon = (type: NodeType, isPort?: boolean) => {
    if (type === 'capital') return <Crown size={12} color="#ffd700" />;
    if (isPort || type === 'port') return <Anchor size={12} color="#38bdf8" />;
    if (type === 'castle') return <Shield size={12} color="#94a3b8" />;
    return <Building2 size={12} color="#f59e0b" />;
  };

  const getTypeBadgeStyle = (type: NodeType, isPort?: boolean) => {
    if (type === 'capital') {
      return { background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', border: '1px solid rgba(255, 215, 0, 0.4)' };
    }
    if (isPort || type === 'port') {
      return { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
    }
    if (type === 'castle') {
      return { background: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.3)' };
    }
    return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 320,
        minWidth: 200,
        flexShrink: 0
      }}
    >
      {/* Search Input Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: 'var(--input-bg)',
          borderRadius: 6,
          border: isOpen ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
          boxShadow: isOpen ? '0 0 10px var(--border-gold-glow)' : 'none',
          transition: 'all 0.2s ease',
          height: 32,
          padding: '0 8px'
        }}
      >
        <Search size={14} color={isOpen ? 'var(--text-gold)' : 'var(--text-muted)'} style={{ flexShrink: 0, marginRight: 6 }} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search 320+ cities, castles, ports, lore..."
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-parchment)',
            fontSize: 12,
            fontFamily: 'var(--font-sans)',
            padding: 0,
            width: '100%'
          }}
        />

        {query ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              color: 'var(--text-muted)'
            }}
            title="Clear search"
          >
            <X size={13} />
          </button>
        ) : (
          <kbd
            style={{
              fontSize: 9,
              padding: '2px 5px',
              borderRadius: 4,
              background: 'var(--bg-card)',
              color: 'var(--text-dim)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'monospace',
              pointerEvents: 'none'
            }}
          >
            ⌘K
          </kbd>
        )}
      </div>

      {/* Autocomplete & Snippet Suggestions Dropdown */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: 420,
            maxWidth: '92vw',
            zIndex: 3000,
            maxHeight: 460,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px var(--border-gold-glow)',
            border: '1px solid var(--border-gold)',
            borderRadius: 8
          }}
        >
          {/* Filter Chips Bar */}
          <div
            style={{
              padding: '6px 10px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4
            }}
          >
            <span
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--text-gold)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Compass size={12} color="var(--text-gold)" />
              {query
                ? `Results (${filteredNodes.length})`
                : typeFilter === 'all'
                  ? `Known World Settlements (${filteredNodes.length})`
                  : `${typeFilter.toUpperCase()} (${filteredNodes.length})`}
            </span>

            <div style={{ display: 'flex', gap: 3 }}>
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'capital', label: 'Capitals' },
                  { id: 'port', label: 'Ports' },
                  { id: 'castle', label: 'Castles' }
                ] as const
              ).map((f) => {
                const isActive = typeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setTypeFilter(f.id)}
                    style={{
                      background: isActive ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                      color: isActive ? 'var(--text-gold-bright)' : 'var(--text-dim)',
                      border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                      borderRadius: 3,
                      padding: '2px 6px',
                      fontSize: 9,
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Suggestions with Snippets */}
          <div
            ref={listRef}
            style={{
              overflowY: 'auto',
              maxHeight: 380,
              padding: '4px 0'
            }}
          >
            {filteredNodes.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MapPin size={22} color="#64748b" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 12, margin: 0 }}>No settlements or lore matched "{query}"</p>
                <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                  Try searching for a castle, region, noble house, or city name.
                </p>
              </div>
            ) : (
              filteredNodes.map((node, index) => {
                const isSelected = index === selectedIndex;
                const badgeStyle = getTypeBadgeStyle(node.type, node.isPort);

                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelect(node.id)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(223, 177, 91, 0.16)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--border-gold)' : '3px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Header line: Type Icon + Settlement Name + Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ display: 'inline-flex' }}>
                          {getTypeIcon(node.type, node.isPort)}
                        </span>
                        <strong
                          className="font-serif"
                          style={{
                            fontSize: 13,
                            color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-parchment)',
                            letterSpacing: '0.3px'
                          }}
                        >
                          {highlightMatch(node.name)}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {node.allegiance && (
                          <span
                            style={{
                              fontSize: 9,
                              color: 'var(--text-muted)',
                              background: 'var(--bg-secondary)',
                              padding: '1px 5px',
                              borderRadius: 3
                            }}
                          >
                            {highlightMatch(node.allegiance)}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '1px 5px',
                            borderRadius: 3,
                            ...badgeStyle
                          }}
                        >
                          {node.isPort && node.type !== 'port' ? 'Port City' : node.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Lore Snippet or Regional Details */}
                    {node.loreSnippet ? (
                      <p
                        style={{
                          fontSize: 11,
                          color: isSelected ? 'var(--text-parchment)' : 'var(--text-muted)',
                          lineHeight: 1.35,
                          margin: '3px 0 6px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {highlightMatch(node.loreSnippet)}
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: 10,
                          color: 'var(--text-dim)',
                          margin: '2px 0 5px',
                          fontStyle: 'italic'
                        }}
                      >
                        Region: {node.region || 'The Known World'} • Seat of House {node.allegiance || 'Ancient Lords'}
                      </p>
                    )}

                    {/* Location Metadata Bar & Action Links */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 10,
                        color: 'var(--text-dim)',
                        marginTop: 4
                      }}
                    >
                      <span>{node.region || 'Known World'}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {onSetOrigin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetOrigin(node.id);
                              handleSelect(node.id);
                            }}
                            style={{
                              background: 'rgba(21, 128, 61, 0.25)',
                              border: '1px solid #16a34a',
                              color: '#86efac',
                              padding: '2px 6px',
                              borderRadius: 3,
                              fontSize: 9,
                              cursor: 'pointer'
                            }}
                            title="Set as Journey Origin"
                          >
                            Origin
                          </button>
                        )}

                        {onSetDestination && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetDestination(node.id);
                              handleSelect(node.id);
                            }}
                            style={{
                              background: 'rgba(185, 28, 28, 0.25)',
                              border: '1px solid #b91c1c',
                              color: '#fca5a5',
                              padding: '2px 6px',
                              borderRadius: 3,
                              fontSize: 9,
                              cursor: 'pointer'
                            }}
                            title="Set as Journey Destination"
                          >
                            Dest
                          </button>
                        )}

                        {node.wikiUrl && (
                          <a
                            href={node.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: 'rgba(223, 177, 91, 0.15)',
                              border: '1px solid rgba(223, 177, 91, 0.35)',
                              color: 'var(--text-gold)',
                              padding: '2px 6px',
                              borderRadius: 3,
                              fontSize: 9,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              textDecoration: 'none',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(223, 177, 91, 0.3)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(223, 177, 91, 0.15)';
                              e.currentTarget.style.color = 'var(--text-gold)';
                            }}
                            title="Open Wiki of Westeros in new tab"
                          >
                            <ExternalLink size={9} />
                            <span>Wiki</span>
                          </a>
                        )}

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 9,
                            color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-dim)',
                            padding: '2px 5px',
                            borderRadius: 3,
                            background: isSelected ? 'rgba(223, 177, 91, 0.25)' : 'var(--bg-secondary)'
                          }}
                        >
                          <Navigation size={9} />
                          Zoom In
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide info */}
          <div
            style={{
              padding: '6px 12px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 9,
              color: 'var(--text-dim)'
            }}
          >
            <span>
              Use <kbd style={{ color: 'var(--text-gold)' }}>↑</kbd> <kbd style={{ color: 'var(--text-gold)' }}>↓</kbd> to navigate, <kbd style={{ color: 'var(--text-gold)' }}>Enter</kbd> to zoom in
            </span>
            <span>{filteredNodes.length} suggested</span>
          </div>
        </div>
      )}
    </div>
  );
};
