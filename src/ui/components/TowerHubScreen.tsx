import './TowerHubScreen.css';
import { useStore } from '../state/store';
import type { TowerFloor } from '@/data/schemas/TowerFloorSchema';
import { DEFAULT_TOWER_CONFIG } from '@/core/config/towerConfig';

export function TowerHubScreen() {
  const {
    towerRun,
    towerStatus,
    getCurrentTowerFloor,
    startTowerRun,
    beginTowerFloorBattle,
    applyTowerRest,
    quitTowerRun,
    exitTowerMode,
    towerEntryContext,
  } = useStore((state) => ({
    towerRun: state.towerRun,
    towerStatus: state.towerStatus,
    getCurrentTowerFloor: state.getCurrentTowerFloor,
    startTowerRun: state.startTowerRun,
    beginTowerFloorBattle: state.beginTowerFloorBattle,
    applyTowerRest: state.applyTowerRest,
    quitTowerRun: state.quitTowerRun,
    exitTowerMode: state.exitTowerMode,
    towerEntryContext: state.towerEntryContext,
  }));

  const currentFloor = getCurrentTowerFloor();

  if (towerStatus === 'idle' || !towerRun) {
    return (
      <div className="tower-hub">
        <section className="tower-card intro">
          <h1>Battle Tower</h1>
          <p>
            Step into an infinite gauntlet built on the queue battle engine. Assemble any four heroes, keep their HP between fights,
            and chase your highest floor on this save-independent sandbox.
          </p>
          <div className="tower-actions">
            <button className="primary" onClick={() => startTowerRun({ difficulty: 'normal' })}>
              Start Tower Run
            </button>
            <button onClick={exitTowerMode}>
              {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const stats = towerRun.stats;
  const isRestFloor = currentFloor?.type === 'rest';
  const isCompleted = towerStatus === 'completed';

  return (
    <div className="tower-hub">
      <section className="tower-card status">
        <header>
          <div>
            <p className="label">Difficulty</p>
            <p className="value">{towerRun.difficulty}</p>
          </div>
          <div>
            <p className="label">Highest Floor</p>
            <p className="value">{stats.highestFloor}</p>
          </div>
          <div>
            <p className="label">Battles Won</p>
            <p className="value">{stats.victories}</p>
          </div>
        </header>
        <div className="timeline">
          <p className="label">Current Floor</p>
          {renderFloor(currentFloor)}
        </div>
      </section>

      <section className="tower-card actions">
        {isCompleted ? (
          <>
            <h2>Run Complete</h2>
            <p>
              {towerRun.isFailed
                ? 'The party fell, but their record stands in the archive.'
                : 'You cleared every defined floor for this phase.'}
            </p>
            <div className="tower-actions">
              <button className="primary" onClick={() => startTowerRun({ difficulty: towerRun.difficulty })}>
                Start New Run
              </button>
              <button onClick={exitTowerMode}>
                {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
              </button>
            </div>
          </>
        ) : isRestFloor ? (
          <>
            <h2>Rest Floor</h2>
            <p>Restore {Math.round(REST_HEAL * 100)}% HP and reset Djinn before the next stretch.</p>
            <div className="tower-actions">
              <button className="primary" onClick={applyTowerRest}>
                Take Rest
              </button>
              <button onClick={beginTowerFloorBattle}>Skip Rest</button>
              <button className="ghost" onClick={quitTowerRun}>
                Quit Run
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{currentFloor ? `Floor ${currentFloor.floorNumber}` : 'All Floors Cleared'}</h2>
            <p>
              {currentFloor
                ? `Encounter: ${currentFloor.encounterId}`
                : 'There are no more encounters defined for this build.'}
            </p>
            <div className="tower-actions">
              <button
                className="primary"
                disabled={!currentFloor || currentFloor.type === 'rest'}
                onClick={beginTowerFloorBattle}
              >
                Begin Battle
              </button>
              <button className="ghost" onClick={quitTowerRun}>
                Quit Run
              </button>
              <button onClick={exitTowerMode}>
                {towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu'}
              </button>
            </div>
          </>
        )}
      </section>

      <section className="tower-card stats">
        <h3>Run Stats</h3>
        <ul>
          <li>
            <span>Turns Taken</span>
            <span>{stats.turnsTaken}</span>
          </li>
          <li>
            <span>Total Damage Dealt</span>
            <span>{stats.totalDamageDealt}</span>
          </li>
          <li>
            <span>Total Damage Taken</span>
            <span>{stats.totalDamageTaken}</span>
          </li>
          <li>
            <span>Retreats</span>
            <span>{stats.retreats}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

const REST_HEAL = DEFAULT_TOWER_CONFIG.healFractionAtRest;

function renderFloor(floor: TowerFloor | null) {
  if (!floor) {
    return <p className="value">No remaining floors</p>;
  }

  if (floor.type === 'rest') {
    return <p className="value rest">Rest Floor · Heal & Regroup</p>;
  }

  if (floor.type === 'boss') {
    return (
      <p className="value boss">
        Boss · {floor.encounterId}
      </p>
    );
  }

  return (
    <p className="value normal">
      Floor {floor.floorNumber} · {floor.encounterId}
    </p>
  );
}

