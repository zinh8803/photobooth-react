import React from 'react';
import './Badge.css';

interface BadgeProps {
  label: string;
  emoji?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, emoji, active, onClick, className = '' }) => {
  return (
    <button
      className={`badge ${active ? 'badge--active' : ''} ${className}`}
      onClick={onClick}
      type="button"
    >
      {emoji && <span className="badge__emoji">{emoji}</span>}
      <span className="badge__label">{label}</span>
    </button>
  );
};

export default Badge;
