import React from 'react';

/**
 * Two-bar rounded hamburger icon matching the design in media_1795679654951_16f6d1bf.png
 */
export default function HamburgerIcon({ size = 22, className = '', color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.05)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`hambor-icon ${className}`}
      {...props}
    >
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  );
}
