/**
 * @fileoverview Reusable PlayStation Styled Button Component
 */
import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const classes = `ps-btn ps-btn-${variant} ps-btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

