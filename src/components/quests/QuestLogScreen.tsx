import React from 'react';
import { useGame } from '@/context/GameContext';
import { Panel } from '@/components/shared/Panel';
import { Button } from '@/components/shared/Button';
import type { Quest } from '@/types/Quest';
import './QuestLogScreen.css';

export const QuestLogScreen: React.FC = () => {
  const { state, actions } = useGame();
  const { quests } = state;

  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedQuests = quests.filter((q) => q.status === 'completed');
  const mainQuests = activeQuests.filter((q) => q.isMainQuest);
  const sideQuests = activeQuests.filter((q) => !q.isMainQuest);

  const renderQuestObjectives = (quest: Quest) => {
    return (
      <div className="quest-objectives">
        {quest.objectives.map((obj) => (
          <div key={obj.id} className={`objective ${obj.completed ? 'completed' : ''}`}>
            <span className="objective-checkbox">{obj.completed ? '☑' : '☐'}</span>
            <span className="objective-text">{obj.text}</span>
            {obj.target > 1 && (
              <span className="objective-progress">
                ({obj.current}/{obj.target})
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestRewards = (quest: Quest) => {
    const { rewards } = quest;
    const rewardParts: string[] = [];

    if (rewards.xp > 0) rewardParts.push(`${rewards.xp} XP`);
    if (rewards.gold > 0) rewardParts.push(`${rewards.gold} Gold`);
    if (rewards.items.length > 0) {
      rewardParts.push(rewards.items.map((i) => i.name).join(', '));
    }
    if (rewards.djinn) {
      rewardParts.push(`Djinn: ${rewards.djinn.name}`);
    }

    return rewardParts.length > 0 ? rewardParts.join(', ') : 'None';
  };

  const renderQuest = (quest: Quest) => {
    return (
      <Panel key={quest.id} className="quest-item">
        <div className="quest-header">
          <h3 className="quest-title">
            {quest.title}
            {quest.isMainQuest && <span className="quest-badge main">Main Quest</span>}
          </h3>
          {quest.questGiver && <span className="quest-giver">Quest Giver: {quest.questGiver}</span>}
        </div>

        <p className="quest-description">{quest.description}</p>

        {renderQuestObjectives(quest)}

        <div className="quest-rewards">
          <strong>Rewards:</strong> {renderQuestRewards(quest)}
        </div>
      </Panel>
    );
  };

  return (
    <div className="quest-log-screen">
      <div className="quest-log-header">
        <h1>Quest Log</h1>
        <Button onClick={() => actions.goBack()}>Back</Button>
      </div>

      {activeQuests.length === 0 && completedQuests.length === 0 && (
        <Panel className="no-quests">
          <p>No quests available. Explore the world and talk to NPCs to find quests!</p>
        </Panel>
      )}

      {mainQuests.length > 0 && (
        <div className="quest-section">
          <h2 className="section-title">Main Quests</h2>
          <div className="quest-list">{mainQuests.map(renderQuest)}</div>
        </div>
      )}

      {sideQuests.length > 0 && (
        <div className="quest-section">
          <h2 className="section-title">Side Quests</h2>
          <div className="quest-list">{sideQuests.map(renderQuest)}</div>
        </div>
      )}

      {completedQuests.length > 0 && (
        <div className="quest-section">
          <h2 className="section-title">Completed Quests ({completedQuests.length})</h2>
          <div className="quest-list completed">{completedQuests.map(renderQuest)}</div>
        </div>
      )}

      <div className="controls-info">
        <p>Press ESC or click Back to return</p>
      </div>
    </div>
  );
};
