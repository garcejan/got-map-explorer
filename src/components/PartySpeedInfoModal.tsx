import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Flame,
  Bird,
  Feather,
  Crown,
  Shield,
  Coins,
  Ship,
  Clock,
  Compass,
  BookOpen
} from 'lucide-react';

interface PartySpeedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPartyId: string;
  onSelectParty: (partyId: string) => void;
}

interface ArchetypeDetail {
  id: string;
  name: string;
  category: 'aerial' | 'land' | 'naval';
  icon: React.ReactNode;
  landSpeedMiles: number;
  landSpeedKm: number;
  seaSpeedMiles: number;
  seaSpeedKm: number;
  howFastPace: string;
  dailyEndurance: string;
  whyLogistics: string;
  canonExample: string;
  quoteOrLore?: string;
}

const ARCHETYPE_DETAILS: ArchetypeDetail[] = [
  {
    id: 'dragon',
    name: 'Dragon Flight (e.g. Balerion / Drogon / Silverwing)',
    category: 'aerial',
    icon: <Flame size={18} color="var(--icon-dragon, #ef4444)" />,
    landSpeedMiles: 520,
    landSpeedKm: 837,
    seaSpeedMiles: 520,
    seaSpeedKm: 837,
    howFastPace: 'Cruising at 65–80 mph (105–130 km/h) with high-speed dive and sprint bursts exceeding 100 mph.',
    dailyEndurance: '7–8 hours sustained flight per day. Limited primarily by the human dragonrider\'s stamina against high-altitude freezing winds and thin air.',
    whyLogistics:
      'Massive apex aerial predators whose enormous wingspans and Valyrian fire-magic allow them to effortlessly ride high-altitude thermal currents. They completely bypass all terrestrial obstacles (swamps, mountains, oceans, forests) and fly in direct straight lines ("as the dragon flies").',
    canonExample:
      'Queen Alysanne flew Silverwing to Winterfell and the Wall in days, far outpacing the royal carriage progress. Daemon Targaryen on Caraxes crossed realms in single flights.',
    quoteOrLore: 'Fire & Blood: "A dragon can fly much faster than any horse can run, even faster than a raven..."'
  },
  {
    id: 'crow',
    name: 'Messenger Crow / Raven',
    category: 'aerial',
    icon: <Bird size={18} color="var(--icon-crow, #c084fc)" />,
    landSpeedMiles: 240,
    landSpeedKm: 386,
    seaSpeedMiles: 240,
    seaSpeedKm: 386,
    howFastPace: 'Continuous direct flight at 30–35 mph (48–56 km/h) carrying lightweight scroll canisters.',
    dailyEndurance: '7–8 hours of daylight flight. Birds must roost at dusk, avoid nocturnal predators, forage for grain/insects, and seek shelter during gales.',
    whyLogistics:
      'Trained citadel ravens (Corvus corax) and carrier birds. While swift and unburdened by terrain, their biological endurance requires rest and water. Flight from the Wall to King\'s Landing (1,500 direct miles) canonically takes 6–7 days in fair weather.',
    canonExample:
      'Urgent black ravens dispatched between the rookeries of Castle Black, Winterfell, and the Red Keep.',
    quoteOrLore: 'Citadel Maesters breed black ravens specifically for high stamina and homing instincts to specific castle towers.'
  },
  {
    id: 'messenger',
    name: 'Fast Courier / Raven Rider',
    category: 'land',
    icon: <Feather size={18} color="var(--icon-messenger, #4ade80)" />,
    landSpeedMiles: 58,
    landSpeedKm: 93,
    seaSpeedMiles: 90,
    seaSpeedKm: 145,
    howFastPace: 'Sustained canter and trot on road (5–7 mph average over long days). Up to 72 mi/day on paved Valyrian highways.',
    dailyEndurance: '10–12 hours per day using a relay system of fresh post-horses at road inns, waycastles, and holdfasts.',
    whyLogistics:
      'Modeled after historical relay couriers (Roman Cursus Publicus, Mongol Yam, American Pony Express). Switching to fresh mounts every 15–20 miles prevents horse exhaustion. Sea transit reflects chartered swift dispatch cutters or packet boats.',
    canonExample:
      'Catelyn Stark\'s urgent secret overland ride south to King\'s Landing with Ser Rodrik Cassel; King\'s Hand messengers riding day and night.',
    quoteOrLore: 'The fastest overland speed possible for humans without magical or aerial aid.'
  },
  {
    id: 'retinue',
    name: 'Noble Retinue / Royal Progress',
    category: 'land',
    icon: <Crown size={18} color="var(--icon-retinue, #fbbf24)" />,
    landSpeedMiles: 18,
    landSpeedKm: 29,
    seaSpeedMiles: 95,
    seaSpeedKm: 153,
    howFastPace: 'Leisurely carriage pace (2.5–3.5 mph) along maintained highways.',
    dailyEndurance: '5–6 hours of travel per day; frequent delays for broken wagon wheels, muddy ruts, ceremonial feasts, and pitching noble pavilions.',
    whyLogistics:
      'Heavily burdened by Queen Cersei\'s double-decked oak wheelhouse, luggage carts, litters, courtly ladies, and armed escorts. King Robert Baratheon\'s progress from King\'s Landing to Winterfell (1,500 miles) took slightly over two months (18–20 miles/day).',
    canonExample:
      'King Robert Baratheon and the Lannister royal court journeying north to Winterfell to name Eddard Stark Hand of the King.',
    quoteOrLore: 'Robert Baratheon: "We have been a month on the road... and the queen\'s wheelhouse has broken another axle."'
  },
  {
    id: 'army',
    name: 'Marching Host / Feudal Army',
    category: 'land',
    icon: <Shield size={18} color="var(--icon-army, #60a5fa)" />,
    landSpeedMiles: 12,
    landSpeedKm: 19,
    seaSpeedMiles: 75,
    seaSpeedKm: 121,
    howFastPace: 'Heavy military column march (2 mph) pacing to the slowest ox-cart and armored infantry levy.',
    dailyEndurance: '6–7 hours of marching per day; extensive daily labor required to construct palisades, forage, dig latrines, and post sentries.',
    whyLogistics:
      'Historical medieval and Roman military logistics. Thousands of armored levies on foot, ox-drawn siege engines, baggage trains, and camp followers. Massive naval transport fleets (75 mi/day) move at the speed of the slowest transport barge to avoid scattering.',
    canonExample:
      'Robb Stark marching 20,000 Northmen south to Riverrun; Tywin Lannister maneuvering his disciplined Westermen hosts across the Riverlands.',
    quoteOrLore: 'Armies march on their stomachs; logistical baggage trains and livestock dictate the pace of conquest.'
  },
  {
    id: 'caravan',
    name: 'Merchant Caravan',
    category: 'land',
    icon: <Coins size={18} color="var(--icon-caravan, #fb923c)" />,
    landSpeedMiles: 15,
    landSpeedKm: 24,
    seaSpeedMiles: 100,
    seaSpeedKm: 161,
    howFastPace: 'Steady laden wagon pace (2.0–2.5 mph) through commercial road corridors.',
    dailyEndurance: '6–8 hours per day; draft animals require daily pasturage, shoe maintenance, and river ferry crossings.',
    whyLogistics:
      'Pack mules and loaded cargo wagons moving trade goods across Westeros and Essos. Commercial convoys prioritize cargo preservation over raw speed. Sea speed (100 mi/day, 4.1 knots) reflects standard merchant trade cogs.',
    canonExample:
      'Spice and silk caravans traveling the Roseroad, the Goldroad, or braving the Red Waste to the gates of Qarth.',
    quoteOrLore: 'Essential for transporting grain, wine, weapons, and exotic eastern luxuries between trading hubs.'
  },
  {
    id: 'fleet',
    name: 'War Galley / Sailing Fleet',
    category: 'naval',
    icon: <Ship size={18} color="var(--icon-fleet, #22d3ee)" />,
    landSpeedMiles: 14,
    landSpeedKm: 22,
    seaSpeedMiles: 115,
    seaSpeedKm: 185,
    howFastPace: 'Cruising speed of 4.8 knots over open water under sail and oars. Reaches 150 mi/day (6.2 knots) with trade winds.',
    dailyEndurance: 'Capable of 24-hour continuous navigation with rotating watch crews when fair winds and coastal landmarks permit.',
    whyLogistics:
      'Oared war galleys and triple-masted merchant cogs skimming along coastal shipping lanes. Overland speed (14 mi/day) represents disembarked sailors or Ironborn reavers marching without horses.',
    canonExample:
      'Stannis Baratheon\'s royal battle fleet sailing to the Blackwater; Ironborn longships raiding up the Mander.',
    quoteOrLore: 'Sea lanes bypass continental landmasses and road obstacles at three to five times the speed of a marching army.'
  }
];

export const PartySpeedInfoModal: React.FC<PartySpeedInfoModalProps> = ({
  isOpen,
  onClose,
  selectedPartyId,
  onSelectParty
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'aerial' | 'land' | 'naval'>('all');
  const [expandedPartyId, setExpandedPartyId] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const filteredArchetypes = ARCHETYPE_DETAILS.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  return createPortal(
    <div
      className="citadel-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--modal-backdrop)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        pointerEvents: 'auto'
      }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="glass-panel citadel-modal-dialog"
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg), 0 0 30px var(--shadow-gold)',
          border: '1px solid var(--border-gold)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--bg-panel)',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-gold-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(223, 177, 91, 0.15) 0%, var(--bg-secondary) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(223, 177, 91, 0.15)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Compass size={18} color="var(--text-gold)" />
            </div>
            <div>
              <h2 className="font-serif" style={{ fontSize: 16, color: 'var(--text-gold)', letterSpacing: '0.8px' }}>
                Travel Party Archetypes: How Fast & Why
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                The Citadel’s Cartographic & Logistical Reference for Overland, Maritime, and Aerial Transit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: '6px 8px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
            title="Close modal (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Highlight Callout: Dragon vs Crow Calibration
        <div
          style={{
            padding: '10px 20px',
            background: 'rgba(239, 68, 68, 0.08)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <Zap size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 11, color: 'var(--text-parchment)', lineHeight: 1.4 }}>
            <strong style={{ color: '#ef4444' }}>Aerial Calibration: </strong>
            <strong>Dragon Flight (520 miles / day)</strong> is calibrated to <strong>2.17× faster</strong> than a{' '}
            <strong>Messenger Raven (240 miles / day)</strong>, aligning with George R.R. Martin canon in{' '}
            <em>Fire & Blood</em> where dragons outpace all heralds and rookeries across Westeros.
          </div>
        </div> */}

        {/* Filter Navigation Tabs */}
        <div
          className="citadel-party-tabs-row"
          style={{
            padding: '8px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}
        >
          <div className="citadel-party-tabs-list" style={{ display: 'flex', gap: 6 }}>
            {(
              [
                { id: 'all', label: 'All 7 Archetypes' },
                { id: 'aerial', label: 'Aerial (Dragon & Raven)' },
                { id: 'land', label: 'Overland (Courier, Progress, Army, Caravan)' },
                { id: 'naval', label: 'Maritime (Fleet)' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filterCategory === tab.id ? '1px solid var(--border-gold)' : '1px solid transparent',
                  background: filterCategory === tab.id ? 'rgba(223, 177, 91, 0.2)' : 'transparent',
                  color: filterCategory === tab.id ? 'var(--text-gold)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            Showing {filteredArchetypes.length} of {ARCHETYPE_DETAILS.length} travel archetypes
          </span>
        </div>

        {/* Table Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredArchetypes.map((party) => {
              const isSelected = party.id === selectedPartyId;
              const isExpanded = expandedPartyId === party.id;

              return (
                <div
                  key={party.id}
                  className="glass-card"
                  style={{
                    padding: '12px 16px',
                    borderColor: isSelected ? 'var(--border-gold)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(223, 177, 91, 0.16)' : 'var(--bg-card)',
                    boxShadow: isSelected ? '0 0 12px var(--border-gold-glow)' : undefined,
                    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s'
                  }}
                >
                  {/* Top Row: Archetype Title + Speeds + Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                      marginBottom: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {party.icon}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h3
                            className="font-serif"
                            style={{
                              fontSize: 14,
                              color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-parchment)'
                            }}
                          >
                            {party.name}
                          </h3>
                          {/* {isSelected && (
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                background: 'var(--badge-success-bg)',
                                color: 'var(--badge-success-text)',
                                padding: '2px 6px',
                                borderRadius: 4,
                                border: '1px solid var(--badge-success-border)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                              }}
                            >
                              <Check size={10} /> SELECTED IN PLANNER
                            </span>
                          )} */}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          Category:{' '}
                          <span style={{ textTransform: 'capitalize', color: 'var(--text-parchment)' }}>
                            {party.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Speed Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          background: 'var(--badge-land-bg)',
                          border: '1px solid var(--badge-land-border)',
                          borderRadius: 4,
                          padding: '4px 8px',
                          textAlign: 'right'
                        }}
                      >
                        <div style={{ fontSize: 9, color: 'var(--badge-land-title)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Land Speed
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--badge-land-val)' }}>
                          {party.landSpeedMiles}{' '}
                          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>
                            mi/day ({party.landSpeedKm} km)
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'var(--badge-sea-bg)',
                          border: '1px solid var(--badge-sea-border)',
                          borderRadius: 4,
                          padding: '4px 8px',
                          textAlign: 'right'
                        }}
                      >
                        <div style={{ fontSize: 9, color: 'var(--badge-sea-title)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Sea Speed
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--badge-sea-val)' }}>
                          {party.seaSpeedMiles}{' '}
                          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>
                            mi/day ({party.seaSpeedKm} km)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectParty(party.id);
                          onClose();
                        }}
                        className={isSelected ? 'btn-citadel' : 'btn-secondary'}
                        style={{
                          padding: '6px 12px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? 'Active Party' : 'Select Party'}
                      </button>
                    </div>
                  </div>

                  {/* Mid Row: How Fast & Why */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.6fr',
                      gap: 12,
                      marginTop: 8,
                      fontSize: 11,
                      lineHeight: 1.45,
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      padding: '10px 12px',
                      borderRadius: 6
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: 'var(--text-gold)',
                          fontWeight: 700,
                          fontSize: 10,
                          textTransform: 'uppercase',
                          marginBottom: 2
                        }}
                      >
                        <Clock size={11} /> How Fast & Daily Endurance
                      </div>
                      <div style={{ color: 'var(--text-parchment)', marginBottom: 4 }}>
                        {party.howFastPace}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                        <strong>Hours:</strong> {party.dailyEndurance}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: 'var(--text-gold)',
                          fontWeight: 700,
                          fontSize: 10,
                          textTransform: 'uppercase',
                          marginBottom: 2
                        }}
                      >
                        <BookOpen size={11} /> Why This Speed? (Historical & Canon Logistics)
                      </div>
                      <div style={{ color: 'var(--text-parchment)' }}>
                        {party.whyLogistics}
                      </div>
                    </div>
                  </div>

                  {/* Lore / Canon Reference */}
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 10,
                      color: 'var(--text-dim)'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-gold)' }}>Canon Reference: </strong>
                      <span style={{ color: 'var(--text-parchment)' }}>{party.canonExample}</span>
                    </div>

                    <button
                      onClick={() => setExpandedPartyId(isExpanded ? null : party.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-gold)',
                        cursor: 'pointer',
                        fontSize: 10,
                        textDecoration: 'underline'
                      }}
                    >
                      {isExpanded ? 'Hide Lore Quote' : 'View Lore Quote'}
                    </button>
                  </div>

                  {/* Collapsible Lore Snippet */}
                  {isExpanded && party.quoteOrLore && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 10px',
                        background: 'rgba(223, 177, 91, 0.1)',
                        borderLeft: '3px solid var(--border-gold)',
                        borderRadius: '0 4px 4px 0',
                        fontStyle: 'italic',
                        fontSize: 11,
                        color: 'var(--text-gold-bright)'
                      }}
                    >
                      {party.quoteOrLore}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 10,
            color: 'var(--text-muted)'
          }}
        >
          <div>
            Speeds are calibrated to the canonical <strong>300-mile Wall</strong> (Shadow Tower to Eastwatch: 297.4 mi)
            and the Kingsroad royal progress milestone (1,500 mi in 2 months).
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
