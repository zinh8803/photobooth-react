import React, { useEffect } from 'react';
import { FrameTemplate, FilterType, CapturedPhoto } from '../../../types';
import { useCamera } from '../../../hooks/useCamera';
import { photoService } from '../../../services/api/photoService';
import CountdownOverlay from '../../atoms/CountdownOverlay';
import FilterSelector from '../../molecules/FilterSelector';
import Button from '../../atoms/Button';
import './CameraCapture.css';

interface CameraCaptureProps {
  frame: FrameTemplate;
  capturedPhotos: CapturedPhoto[];
  currentFilter: FilterType;
  countdown: number | null;
  isCapturing: boolean;
  onFilterChange: (filter: FilterType) => void;
  onCapture: (photo: CapturedPhoto) => void;
  onStartCapture: () => void;
  onBack: () => void;
  onNext: () => void;
  timerSelection: number;
  onTimerChange: (timer: number) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  frame,
  capturedPhotos,
  currentFilter,
  countdown,
  isCapturing,
  onFilterChange,
  onCapture,
  onStartCapture,
  onBack,
  onNext,
  timerSelection,
  onTimerChange,
}) => {
  const { videoRef, isReady, error, facingMode, toggleCamera, takePicture } = useCamera();
  const lastPreviewUrl = capturedPhotos.length > 0
    ? capturedPhotos[capturedPhotos.length - 1].dataUrl
    : undefined;

  const filterString = photoService.getFilterString(currentFilter);
  const allCaptured = capturedPhotos.length >= frame.photoCount;

  // Listen for capture trigger from parent
  useEffect(() => {
    const handleCapture = () => {
      const dataUrl = takePicture(filterString);
      if (!dataUrl) return;
      const photo: CapturedPhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dataUrl,
        timestamp: new Date(),
        filter: currentFilter,
      };
      onCapture(photo);
    };

    window.addEventListener('photobooth:capture', handleCapture);
    return () => window.removeEventListener('photobooth:capture', handleCapture);
  }, [takePicture, filterString, currentFilter, onCapture]);

  return (
    <div className="camera-capture">
      {/* Header */}
      <div className="camera-capture__header">
        <button className="camera-capture__back" onClick={onBack} type="button">
          ← Quay lại
        </button>
        <div className="camera-capture__progress">
          {Array.from({ length: frame.photoCount }).map((_, i) => (
            <div
              key={i}
              className={`camera-capture__dot ${i < capturedPhotos.length ? 'camera-capture__dot--filled' : ''} ${i === capturedPhotos.length && isCapturing ? 'camera-capture__dot--pulse' : ''}`}
            />
          ))}
        </div>
        <div className="camera-capture__frame-name">{frame.nameVi}</div>
      </div>

      {/* Main layout */}
      <div className="camera-capture__body">
        {/* Camera View */}
        <div className="camera-capture__video-wrap">
          {error ? (
            <div className="camera-capture__error">
              <span className="camera-capture__error-icon">📷</span>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-capture__video"
                style={{ filter: filterString }}
              />
              {!isReady && (
                <div className="camera-capture__loading">
                  <div className="camera-capture__video-spinner" />
                  <p>Đang kết nối camera...</p>
                </div>
              )}
              {countdown !== null && <CountdownOverlay count={countdown} />}
            </>
          )}

          {/* Frame indicator overlay */}
          <div className="camera-capture__frame-badge">
            <span style={{ color: frame.borderColor }}>■</span> {frame.nameVi}
          </div>
        </div>

        {/* Side panel */}
        <div className="camera-capture__sidebar">
          {/* Photo strips */}
          <div className="camera-capture__strips">
            <p className="camera-capture__strips-title">
              📸 Ảnh đã chụp ({capturedPhotos.length}/{frame.photoCount})
            </p>
            <div className="camera-capture__strip-list">
              {Array.from({ length: frame.photoCount }).map((_, i) => {
                const photo = capturedPhotos[i];
                return (
                  <div
                    key={i}
                    className={`camera-capture__strip-slot ${photo ? 'camera-capture__strip-slot--filled' : ''}`}
                  >
                    {photo ? (
                      <img
                        src={photo.dataUrl}
                        alt={`Photo ${i + 1}`}
                        style={{ filter: photoService.getFilterString(photo.filter) }}
                      />
                    ) : (
                      <span className="camera-capture__strip-num">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter selector */}
          <FilterSelector
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
            previewUrl={lastPreviewUrl}
          />

          {/* Controls */}
          <div className="camera-capture__controls">
            {!allCaptured ? (
              <>
                {!isCapturing && (
                  <div className="camera-capture__timer-select">
                    <span className="camera-capture__timer-label">⏱️</span>
                    {[5, 7, 10].map((t) => (
                      <button
                        key={t}
                        className={`camera-capture__timer-btn ${timerSelection === t ? 'camera-capture__timer-btn--active' : ''}`}
                        onClick={() => onTimerChange(t)}
                        type="button"
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!isReady || isCapturing}
                  onClick={onStartCapture}
                  icon={<span>📸</span>}
                >
                  {isCapturing
                    ? 'Đang chụp...'
                    : `Chụp ảnh ${capturedPhotos.length + 1}/${frame.photoCount}`}
                </Button>
                <button
                  className="camera-capture__flip-btn"
                  onClick={toggleCamera}
                  type="button"
                  title="Đổi camera"
                >
                  🔄 {facingMode === 'user' ? 'Camera trước' : 'Camera sau'}
                </button>
              </>
            ) : (
              <Button
                variant="success"
                size="lg"
                fullWidth
                onClick={onNext}
                icon={<span>✨</span>}
              >
                Xem kết quả!
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Remaining indicator */}
      {!allCaptured && (
        <div className="camera-capture__remaining">
          Còn <strong>{frame.photoCount - capturedPhotos.length}</strong> ảnh nữa
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
