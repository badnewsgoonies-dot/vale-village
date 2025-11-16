/**
 * SaveMenu Component
 * Displays 3 save slots with metadata and save/load/delete actions
 */

import { useState, useEffect } from 'react';
import { useStore } from '../state/store';
import type { SaveSlotMetadata } from '../../core/services/SaveService';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { BackgroundSprite } from '../sprites/BackgroundSprite';
import './SaveMenu.css';

interface SaveMenuProps {
  onClose: () => void;
}

/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'No save';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format playtime in seconds to readable format
 */
function formatPlaytime(seconds?: number): string {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export function SaveMenu({ onClose }: SaveMenuProps) {
  const { saveGameSlot, loadGameSlot, deleteSaveSlot, getSaveSlotMetadata: getMetadata } = useStore();
  const [slots, setSlots] = useState<SaveSlotMetadata[]>([
    { exists: false },
    { exists: false },
    { exists: false },
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [action, setAction] = useState<'save' | 'load' | 'delete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh slot metadata
  const refreshSlots = () => {
    setSlots([
      getMetadata(0),
      getMetadata(1),
      getMetadata(2),
    ]);
  };

  useEffect(() => {
    refreshSlots();
  }, []);

  const handleSlotClick = (slotIndex: number) => {
    if (action === 'save') {
      handleSave(slotIndex);
    } else if (action === 'load') {
      handleLoad(slotIndex);
    } else if (action === 'delete') {
      setSelectedSlot(slotIndex);
    } else {
      // No action selected, do nothing
    }
  };

  const handleSave = async (slotIndex: number) => {
    setIsLoading(true);
    setError(null);
    try {
      saveGameSlot(slotIndex);
      refreshSlots();
      setAction(null);
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (slotIndex: number) => {
    if (!slots[slotIndex]?.exists) {
      setError('No save file found in this slot');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      loadGameSlot(slotIndex);
      onClose(); // Close menu after loading
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (slotIndex: number) => {
    if (!slots[slotIndex]?.exists) {
      return;
    }
    deleteSaveSlot(slotIndex);
    refreshSlots();
    setSelectedSlot(null);
    setAction(null);
  };

  const handleConfirmDelete = () => {
    if (selectedSlot !== null) {
      handleDelete(selectedSlot);
    }
  };

  return (
    <div className="save-menu-overlay" onClick={onClose}>
      <div className="save-menu-container" onClick={(e) => e.stopPropagation()}>
        <BackgroundSprite
          id="random"
          category="backgrounds-gs1"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.3,
            borderRadius: '12px',
            zIndex: -1,
          }}
        />
        <div className="save-menu-header">
          <h1>Save / Load Game</h1>
          <button className="close-btn" onClick={onClose} aria-label="Close save menu">
            ×
          </button>
        </div>

        {error && (
          <div className="save-menu-error" role="alert">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="save-menu-loading">
            {action === 'save' ? 'Saving...' : 'Loading...'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="save-menu-actions">
          <button
            className={`action-btn ${action === 'save' ? 'active' : ''}`}
            onClick={() => {
              setAction(action === 'save' ? null : 'save');
              setSelectedSlot(null);
            }}
            disabled={isLoading}
          >
            <SimpleSprite
              id="save-game"
              width={24}
              height={24}
              style={{ marginRight: '8px' }}
            />
            New Save
          </button>
          <button
            className={`action-btn ${action === 'load' ? 'active' : ''}`}
            onClick={() => {
              setAction(action === 'load' ? null : 'load');
              setSelectedSlot(null);
            }}
            disabled={isLoading}
          >
            <SimpleSprite
              id="continue"
              width={24}
              height={24}
              style={{ marginRight: '8px' }}
            />
            Load Save
          </button>
        </div>

        {/* Save Slots */}
        <div className="save-slots">
          {slots.map((slot, index) => (
            <div
              key={index}
              className={`save-slot ${selectedSlot === index ? 'selected' : ''} ${!slot.exists ? 'empty' : ''}`}
              onClick={() => handleSlotClick(index)}
            >
              <div className="save-slot-header">
                <h2>Slot {index + 1}</h2>
                {action === 'save' && (
                  <span className="action-indicator">Click to save</span>
                )}
                {action === 'load' && slot.exists && (
                  <span className="action-indicator">Click to load</span>
                )}
                {action === 'delete' && slot.exists && (
                  <span className="action-indicator">Click to delete</span>
                )}
              </div>

              {slot.exists ? (
                <div className="save-slot-content">
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div className="save-slot-portrait">
                      <SimpleSprite
                        id="isaac1"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="save-slot-meta">
                      <div className="meta-row">
                        <span className="meta-label">Date:</span>
                        <span className="meta-value">{formatTimestamp(slot.timestamp)}</span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-label">Playtime:</span>
                        <span className="meta-value">{formatPlaytime(slot.playtime)}</span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-label">Team Level:</span>
                        <span className="meta-value">Lv. {slot.teamLevel ?? 1}</span>
                      </div>
                      <div className="meta-row">
                        <span className="meta-label">Gold:</span>
                        <span className="meta-value">{slot.gold ?? 0}g</span>
                      </div>
                      {slot.chapter && (
                        <div className="meta-row">
                          <span className="meta-label">Chapter:</span>
                          <span className="meta-value">{slot.chapter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="save-slot-empty">
                  <span>Empty Slot</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delete Confirmation */}
        {action === 'delete' && selectedSlot !== null && slots[selectedSlot]?.exists && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this save?</p>
            <div className="confirmation-buttons">
              <button
                className="confirm-btn"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedSlot(null);
                  setAction(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Button */}
        {action !== 'delete' && (
          <div className="save-menu-footer">
            <button
              className="delete-action-btn"
              onClick={() => {
                setAction('delete');
                setSelectedSlot(null);
              }}
              disabled={isLoading}
            >
              <SimpleSprite
                id="erase-file"
                width={24}
                height={24}
                style={{ marginRight: '8px' }}
              />
              Delete Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


