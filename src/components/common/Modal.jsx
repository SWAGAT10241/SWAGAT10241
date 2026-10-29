/**
 * @fileoverview Accessible Modal Dialog Component
 */
import React, { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ps-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ps-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ps-modal-header">
          <h3 className="ps-modal-title">{title}</h3>
          <button
            type="button"
            className="ps-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="ps-modal-body">{children}</div>
      </div>
    </div>
  );
}

