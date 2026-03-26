import React from 'react';
import './CountdownOverlay.css';

interface CountdownOverlayProps {
  count: number;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count }) => {
  return (
    <div className="countdown-overlay">
      <div className="countdown-overlay__number" key={count}>
        {count}
      </div>
      <p className="countdown-overlay__text">
        {count === 3 ? '📸 Chuẩn bị nào!' : count === 2 ? '😎 Tạo dáng đi!' : '✨ Cười lên!'}
      </p>
    </div>
  );
};

export default CountdownOverlay;
