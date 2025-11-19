/**
 * Dev Mode Overlay Component
 * Displays house selection UI for rapid testing
 *
 * IMPORTANT: This component only renders when dev mode is enabled (Ctrl+D)
 */

import { useEffect } from 'react';
import { useStore } from '../state/store';
import { getAllHousesMetadata, jumpToHouse } from '../../core/services/DevModeService';

export function DevModeOverlay() {
  const devModeEnabled = useStore((state) => state.devModeEnabled);
  const setDevModeEnabled = useStore((state) => state.setDevModeEnabled);

  const story = useStore((state) => state.story);
  const team = useStore((state) => state.team);
  const roster = useStore((state) => state.roster);

  const setStoryState = useStore((state) => state.setStoryState);
  const setTeam = useStore((state) => state.setTeam);
  const setRoster = useStore((state) => state.setRoster);

  const setPendingBattle = useStore((state) => state.setPendingBattle);

  // Listen for ESC key to close
  useEffect(() => {
    if (!devModeEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDevModeEnabled(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [devModeEnabled, setDevModeEnabled]);

  // Don't render if dev mode is disabled
  if (!devModeEnabled) return null;

  const houses = getAllHousesMetadata();

  // Handle jumping to a specific house
  const handleJumpToHouse = (houseId: string) => {
    if (!team) {
      console.error('Cannot jump to house: no team exists');
      return;
    }

    // Apply jump-to-house logic
    const { story: newStory, team: newTeam, roster: newRoster } = jumpToHouse(
      story,
      team,
      roster,
      houseId
    );

    // Update state
    setStoryState(newStory);
    setTeam(newTeam);
    setRoster(newRoster);

    // Start the encounter (sets pending battle, which shows team select screen)
    setPendingBattle(houseId);

    // Close dev mode overlay
    setDevModeEnabled(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      overflow: 'auto',
      padding: '40px 20px',
      color: '#fff',
      fontFamily: 'monospace',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', borderBottom: '2px solid #666', paddingBottom: '8px' }}>
            🏠 DEV MODE: HOUSE SELECTION
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Press <strong>ESC</strong> to close | Click a house to jump and start battle
          </p>
        </div>

        {/* Houses grouped by Act */}
        {[1, 2, 3].map((act) => {
          const actHouses = houses.filter((h) => h.act === act);
          const actName =
            act === 1
              ? 'Act 1: Discovery (Houses 1-7)'
              : act === 2
              ? 'Act 2: Resistance (Houses 8-14)'
              : 'Act 3: Liberation (Houses 15-20)';

          return (
            <div key={act} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', color: '#ffa500', marginBottom: '16px' }}>
                {actName}
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {actHouses.map((house) => {
                  const rewards: string[] = [];
                  if (house.rewards.unit) rewards.push(`+${house.rewards.unit}`);
                  if (house.rewards.storyJoinUnit) rewards.push(`+${house.rewards.storyJoinUnit} (story join)`);
                  if (house.rewards.djinn) rewards.push(`+${house.rewards.djinn} (Djinn)`);

                  const isCompleted = story.flags[house.id] === true;

                  return (
                    <button
                      key={house.id}
                      onClick={() => handleJumpToHouse(house.id)}
                      style={{
                        padding: '16px',
                        backgroundColor: house.isFinalBoss
                          ? '#8b0000'
                          : house.isSpike
                          ? '#ff6600'
                          : isCompleted
                          ? '#2a5a2a'
                          : '#1a1a2e',
                        border: `2px solid ${isCompleted ? '#4a7a4a' : '#444'}`,
                        borderRadius: '8px',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = house.isFinalBoss
                          ? '#a00000'
                          : house.isSpike
                          ? '#ff7700'
                          : isCompleted
                          ? '#3a6a3a'
                          : '#2a2a3e';
                        e.currentTarget.style.borderColor = '#888';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = house.isFinalBoss
                          ? '#8b0000'
                          : house.isSpike
                          ? '#ff6600'
                          : isCompleted
                          ? '#2a5a2a'
                          : '#1a1a2e';
                        e.currentTarget.style.borderColor = isCompleted ? '#4a7a4a' : '#444';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {house.displayName}
                          {isCompleted && ' ✓'}
                          {house.isSpike && ' ⚠️'}
                          {house.isFinalBoss && ' 💀'}
                        </span>
                        <span style={{ color: '#aaa' }}>
                          {house.rewards.xp} XP | {house.rewards.gold} Gold
                        </span>
                      </div>
                      {rewards.length > 0 && (
                        <div style={{ color: '#ffa500', fontSize: '12px' }}>
                          {rewards.join(' | ')}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
          <p>
            Legend: ⚠️ = XP Spike (H08, H15) | 💀 = Final Boss (H20) | ✓ = Completed
          </p>
          <p style={{ marginTop: '8px' }}>
            Dev Mode active - Press <strong>Ctrl+D</strong> to toggle
          </p>
        </div>
      </div>
    </div>
  );
}
