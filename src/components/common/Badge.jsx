/**
 * @fileoverview Reusable Status Badge Component
 */
import React from 'react';

export function Badge({ children, variant = 'primary', className = '' }) {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`ps-badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}

