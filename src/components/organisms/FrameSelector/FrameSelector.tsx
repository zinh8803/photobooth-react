import React, { useState, useEffect } from 'react';
import { FrameTemplate, FrameCategory } from '../../../types';
import { frameService } from '../../../services/api/frameService';
import { FRAME_CATEGORIES } from '../../../data/frames';
import Badge from '../../atoms/Badge';
import FrameCard from '../../molecules/FrameCard';
import './FrameSelector.css';

interface FrameSelectorProps {
  selectedFrame: FrameTemplate | null;
  onSelect: (frame: FrameTemplate) => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedFrame, onSelect }) => {
  const [frames, setFrames] = useState<FrameTemplate[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    setLoading(true);
    const res = await frameService.getAllFrames(1, 100);
    if (res.success) {
      setFrames(res.data.frames);
    }
    setLoading(false);
  };

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    setLoading(true);

    if (category === 'all') {
      const res = await frameService.getAllFrames(1, 100);
      if (res.success) setFrames(res.data.frames);
    } else {
      const res = await frameService.getFramesByCategory(category as FrameCategory);
      if (res.success) setFrames(res.data);
    }

    setLoading(false);
  };

  return (
    <div className="frame-selector">
      <div className="frame-selector__header">
        <h2 className="frame-selector__title">
          <span className="frame-selector__title-icon">🖼️</span>
          Chọn Khung Hình
        </h2>
        <p className="frame-selector__subtitle">
          Chọn khung yêu thích để bắt đầu chụp ảnh!
        </p>
      </div>

      {/* Category Filters */}
      <div className="frame-selector__categories">
        {FRAME_CATEGORIES.map((cat) => (
          <Badge
            key={cat.id}
            label={cat.label}
            emoji={cat.emoji}
            active={activeCategory === cat.id}
            onClick={() => handleCategoryChange(cat.id)}
          />
        ))}
      </div>

      {/* Frame Grid */}
      {loading ? (
        <div className="frame-selector__loading">
          <div className="frame-selector__spinner" />
          <p>Đang tải khung hình...</p>
        </div>
      ) : (
        <div className="frame-selector__grid">
          {frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              selected={selectedFrame?.id === frame.id}
              onClick={() => onSelect(frame)}
            />
          ))}
        </div>
      )}

      {/* Decorative elements */}
      <div className="frame-selector__deco frame-selector__deco--1">✨</div>
      <div className="frame-selector__deco frame-selector__deco--2">📸</div>
      <div className="frame-selector__deco frame-selector__deco--3">🌸</div>
    </div>
  );
};

export default FrameSelector;
