/**
 * @fileoverview On-screen Virtual Touch Controls for Mobile and Tablets
 */
import React from 'react';

export function VirtualControls({ inputController }) {
  const handleTouchStart = (key) => (e) => {
    e.preventDefault();
    if (!inputController) return;
    if (key === 'parry') {
      inputController.triggerParry();
    } else {
      inputController.keys[key] = true;
    }
  };

  const handleTouchEnd = (key) => (e) => {
    e.preventDefault();
    if (!inputController) return;
    if (key !== 'parry') {
      inputController.keys[key] = false;
    }
  };

  return (
    <div className="mobile-touch-bar" aria-label="Touch Controls">
      <div className="touch-group">
        <button
          type="button"
          className="touch-btn"
          onTouchStart={handleTouchStart('left')}
          onTouchEnd={handleTouchEnd('left')}
          onMouseDown={handleTouchStart('left')}
          onMouseUp={handleTouchEnd('left')}
          aria-label="Move Left"
        >
          ◀
        </button>
        <button
          type="button"
          className="touch-btn"
          onTouchStart={handleTouchStart('right')}
          onTouchEnd={handleTouchEnd('right')}
          onMouseDown={handleTouchStart('right')}
          onMouseUp={handleTouchEnd('right')}
          aria-label="Move Right"
        >
          ▶
        </button>
      </div>

      <div className="touch-group">
        <button
          type="button"
          className="touch-btn touch-btn-danger"
          onTouchStart={handleTouchStart('fire')}
          onTouchEnd={handleTouchEnd('fire')}
          onMouseDown={handleTouchStart('fire')}
          onMouseUp={handleTouchEnd('fire')}
          aria-label="Fire Weapons"
        >
          ⚡
        </button>
        <button
          type="button"
          className="touch-btn touch-btn-parry"
          onTouchStart={handleTouchStart('parry')}
          onMouseDown={handleTouchStart('parry')}
          aria-label="Parry Shield"
        >
          🛡️
        </button>
      </div>
    </div>
  );
}

