import React from 'react';
import { FilterType } from '../../../types';
import { photoService } from '../../../services/api/photoService';
import './FilterSelector.css';

interface FilterSelectorProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  previewUrl?: string;
}

const FILTERS: { id: FilterType; label: string; emoji: string }[] = [
  { id: 'none', label: 'Tự nhiên', emoji: '🌿' },
  { id: 'warm', label: 'Ấm áp', emoji: '🌅' },
  { id: 'vivid', label: 'Tươi sáng', emoji: '✨' },
  { id: 'cool', label: 'Mát mẻ', emoji: '🫐' },
  { id: 'vintage', label: 'Cổ điển', emoji: '📽️' },
  { id: 'sepia', label: 'Sepia', emoji: '🍂' },
  { id: 'grayscale', label: 'Đen trắng', emoji: '🖤' },
  { id: 'fade', label: 'Mờ nhạt', emoji: '🌫️' },
];

const FilterSelector: React.FC<FilterSelectorProps> = ({
  currentFilter,
  onFilterChange,
  previewUrl,
}) => {
  return (
    <div className="filter-selector">
      <p className="filter-selector__title">🎨 Bộ lọc màu</p>
      <div className="filter-selector__list">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`filter-selector__item ${currentFilter === f.id ? 'filter-selector__item--active' : ''}`}
            onClick={() => onFilterChange(f.id)}
            type="button"
          >
            {previewUrl && (
              <div className="filter-selector__preview-wrap">
                <img
                  src={previewUrl}
                  alt={f.label}
                  className="filter-selector__preview-img"
                  style={{ filter: photoService.getFilterString(f.id) }}
                />
              </div>
            )}
            {!previewUrl && (
              <div
                className="filter-selector__swatch"
                style={{ filter: photoService.getFilterString(f.id) }}
              >
                <span className="filter-selector__swatch-emoji">{f.emoji}</span>
              </div>
            )}
            <span className="filter-selector__label">{f.label}</span>
            {currentFilter === f.id && <span className="filter-selector__dot" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;
