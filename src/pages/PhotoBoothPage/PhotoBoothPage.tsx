import React, { useCallback } from 'react';
import { usePhotoBoothState } from '../../hooks/usePhotoBoothState';
import { photoService } from '../../services/api/photoService';
import { CapturedPhoto } from '../../types';
import FrameSelector from '../../components/organisms/FrameSelector';
import CameraCapture from '../../components/organisms/CameraCapture';
import PhotoPreview from '../../components/organisms/PhotoPreview';
import './PhotoBoothPage.css';

const PhotoBoothPage: React.FC = () => {
  const {
    state,
    selectFrame,
    setFilter,
    addPhoto,
    setCountdown,
    setCapturing,
    setStep,
    setFinalImage,
    reset,
  } = usePhotoBoothState();

  const [timerSelection, setTimerSelection] = React.useState<number>(3);

  // Helper to start the countdown interval (or capture instantly when timer === 0)
  const startCountdown = useCallback(() => {
    if (!state.selectedFrame) return;
    setCapturing(true);

    // Instant capture – no countdown
    if (timerSelection === 0) {
      setCountdown(null);
      window.dispatchEvent(new CustomEvent('photobooth:capture'));
      return;
    }

    let count = timerSelection;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        // Trigger capture via custom event
        window.dispatchEvent(new CustomEvent('photobooth:capture'));
      }
    }, 1000);
  }, [state.selectedFrame, setCapturing, setCountdown, timerSelection]);

  // Start countdown and capture manually
  const handleStartCapture = useCallback(() => {
    if (state.isCapturing) return;
    startCountdown();
  }, [state.isCapturing, startCountdown]);

  // Handle actual capture from camera
  const handleCapture = useCallback(
    (photo: CapturedPhoto) => {
      addPhoto(photo);
      setCapturing(false);

      // Check if all photos captured
      const totalNeeded = state.selectedFrame?.photoCount ?? 0;
      if (state.capturedPhotos.length + 1 >= totalNeeded) {
        // Small delay before going to preview
        setTimeout(() => {
          setStep('preview');
        }, 500);
      } else if (timerSelection > 0) {
        // AUTO-CONTINUOUS only when using a timed countdown (not instant mode)
        setTimeout(() => {
          startCountdown();
        }, 1000);
      }
      // When timerSelection === 0 (instant): do nothing after capture,
      // user must press the button again for the next shot.
    },
    [addPhoto, setCapturing, state.capturedPhotos.length, state.selectedFrame?.photoCount, setStep, startCountdown, timerSelection]
  );

  const handleRetake = useCallback(() => {
    setStep('capture');
    setFinalImage(null);
  }, [setStep, setFinalImage]);

  const handleDownload = useCallback(() => {
    // Already handled in PhotoPreview
  }, []);

  const handleBack = useCallback(() => {
    reset();
  }, [reset]);

  const getStepLabel = () => {
    switch (state.step) {
      case 'select-frame': return '01';
      case 'capture': return '02';
      case 'preview': return '03';
      default: return '01';
    }
  };

  const stepLabels = [
    { num: '01', label: 'Chọn khung' },
    { num: '02', label: 'Chụp ảnh' },
    { num: '03', label: 'Tải về' },
  ];

  return (
    <div className="photobooth-page">
      {/* Animated background blobs */}
      <div className="photobooth-page__bg">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <div className="blob blob--4" />
      </div>

      {/* Header */}
      <header className="photobooth-page__header">
        <div className="photobooth-page__logo" onClick={reset} role="button" tabIndex={0}>
          <span className="photobooth-page__logo-icon">📸</span>
          <span className="photobooth-page__logo-text">
            Photo<span>Zinh</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="photobooth-page__steps">
          {stepLabels.map((s, i) => {
            const stepOrder = ['select-frame', 'capture', 'preview'];
            const currentIdx = stepOrder.indexOf(state.step);
            const isActive = s.num === getStepLabel();
            const isDone = stepOrder.indexOf(stepOrder[i]) < currentIdx;
            return (
              <div
                key={s.num}
                className={`step-indicator ${isActive ? 'step-indicator--active' : ''} ${isDone ? 'step-indicator--done' : ''}`}
              >
                <div className="step-indicator__num">{isDone ? '✓' : s.num}</div>
                <span className="step-indicator__label">{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="photobooth-page__header-right">
          <span className="photobooth-page__tagline">Miễn phí · Đẹp · Dễ thương</span>
        </div>
      </header>

      {/* Main content */}
      <main className="photobooth-page__main">
        <div className="photobooth-page__card">
          {state.step === 'select-frame' && (
            <FrameSelector
              selectedFrame={state.selectedFrame}
              onSelect={selectFrame}
            />
          )}

          {state.step === 'capture' && state.selectedFrame && (
            <CameraCapture
              frame={state.selectedFrame}
              capturedPhotos={state.capturedPhotos}
              currentFilter={state.currentFilter}
              countdown={state.countdown}
              isCapturing={state.isCapturing}
              onFilterChange={setFilter}
              onCapture={handleCapture}
              onStartCapture={handleStartCapture}
              onBack={handleBack}
              onNext={() => setStep('preview')}
              timerSelection={timerSelection}
              onTimerChange={setTimerSelection}
            />
          )}

          {state.step === 'preview' && state.selectedFrame && (
            <PhotoPreview
              frame={state.selectedFrame}
              photos={state.capturedPhotos}
              onDownload={handleDownload}
              onRetake={handleRetake}
              onReset={reset}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="photobooth-page__footer">
        <p>Made with 💖 · PhotoZinh — Chụp ảnh photobooth online miễn phí</p>
      </footer>
    </div>
  );
};

export default PhotoBoothPage;
