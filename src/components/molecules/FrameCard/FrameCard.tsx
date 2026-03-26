import React from 'react';
import { FrameTemplate } from '../../../types';
import './FrameCard.css';

interface FrameCardProps {
  frame: FrameTemplate;
  selected?: boolean;
  onClick: () => void;
}

const layoutIcons: Record<string, string> = {
  '4strip': '▌▌▌▌',
  '2x2': '⊞',
  '3x1': '▌▌▌',
  '1x1': '▬',
};

const FrameCard: React.FC<FrameCardProps> = ({ frame, selected, onClick }) => {
  return (
    <button
      className={`frame-card ${selected ? 'frame-card--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {/* Preview */}
      <div
        className="frame-card__preview"
        style={{
          backgroundColor: frame.backgroundColor,
          border: `${Math.min(frame.borderWidth, 6)}px solid ${frame.borderColor}`,
          borderRadius: `${Math.min(frame.cornerRadius, 12)}px`,
        }}
      >
        <div className="frame-card__layout">
          {frame.layout === '4strip' && (
            <div className="frame-card__strip">
              {[0,1,2,3].map(i => (
                <div key={i} className="frame-card__photo-slot" style={{ backgroundColor: `${frame.borderColor}22` }} />
              ))}
            </div>
          )}
          {frame.layout === '2x2' && (
            <div className="frame-card__grid2x2">
              {[0,1,2,3].map(i => (
                <div key={i} className="frame-card__photo-slot" style={{ backgroundColor: `${frame.borderColor}22` }} />
              ))}
            </div>
          )}
          {frame.layout === '3x1' && (
            <div className="frame-card__strip">
              {[0,1,2].map(i => (
                <div key={i} className="frame-card__photo-slot" style={{ backgroundColor: `${frame.borderColor}22` }} />
              ))}
            </div>
          )}
          {frame.layout === '1x1' && (
            <div className="frame-card__single">
              <div className="frame-card__photo-slot" style={{ backgroundColor: `${frame.borderColor}22` }} />
            </div>
          )}
        </div>

        {/* Sticker previews */}
        {frame.stickers && frame.stickers.slice(0, 2).map(s => (
          <span
            key={s.id}
            className="frame-card__sticker"
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: `${s.size * 0.4}px`,
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            }}
          >
            {s.emoji}
          </span>
        ))}

        {selected && (
          <div className="frame-card__check">✓</div>
        )}
      </div>

      {/* Info */}
      <div className="frame-card__info">
        <p className="frame-card__name">{frame.nameVi}</p>
        <p className="frame-card__count">📷 {frame.photoCount} ảnh</p>
      </div>
    </button>
  );
};

export default FrameCard;
