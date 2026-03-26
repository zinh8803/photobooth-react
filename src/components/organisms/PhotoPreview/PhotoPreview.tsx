import React, { useEffect, useState } from 'react';
import { FrameTemplate, CapturedPhoto } from '../../../types';
import { usePhotoComposer } from '../../../hooks/usePhotoComposer';
import { photoService } from '../../../services/api/photoService';
import Button from '../../atoms/Button';
import './PhotoPreview.css';

interface PhotoPreviewProps {
  frame: FrameTemplate;
  photos: CapturedPhoto[];
  onDownload: () => void;
  onRetake: () => void;
  onReset: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  frame,
  photos,
  onDownload,
  onRetake,
  onReset,
}) => {
  const { composePhoto } = usePhotoComposer();
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [composing, setComposing] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setComposing(true);

    composePhoto(frame, photos)
      .then((url) => {
        if (!cancelled) {
          setComposedUrl(url);
          setComposing(false);
        }
      })
      .catch((err) => {
        console.error('Compose error:', err);
        if (!cancelled) setComposing(false);
      });

    return () => { cancelled = true; };
  }, [frame, photos, composePhoto]);

  const handleDownload = () => {
    if (!composedUrl) return;
    const filename = photoService.generateFilename('photobooth');
    photoService.downloadPhoto(composedUrl, filename);
    setDownloadSuccess(true);
    onDownload();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="photo-preview">
      <div className="photo-preview__header">
        <h2 className="photo-preview__title">✨ Kết Quả Photobooth</h2>
        <p className="photo-preview__subtitle">Ảnh của bạn đã sẵn sàng để tải về!</p>
      </div>

      <div className="photo-preview__body">
        {/* Photo result */}
        <div className="photo-preview__result-wrap">
          {composing ? (
            <div className="photo-preview__composing">
              <div className="photo-preview__compose-spinner" />
              <p>Đang tạo ảnh photobooth...</p>
              <p className="photo-preview__compose-sub">✨ Sắp xong rồi!</p>
            </div>
          ) : composedUrl ? (
            <div className="photo-preview__result">
              <img
                src={composedUrl}
                alt="Photobooth result"
                className="photo-preview__image"
              />
              {downloadSuccess && (
                <div className="photo-preview__success-badge">
                  ✅ Đã tải về thành công!
                </div>
              )}
            </div>
          ) : (
            <div className="photo-preview__error">
              <p>❌ Không thể tạo ảnh. Vui lòng thử lại.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="photo-preview__actions">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={!composedUrl || composing}
            onClick={handleDownload}
            icon={<span>⬇️</span>}
          >
            Tải Ảnh Về
          </Button>

          <div className="photo-preview__secondary-actions">
            <Button
              variant="ghost"
              size="md"
              onClick={onRetake}
              icon={<span>🔄</span>}
            >
              Chụp lại
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={onReset}
              icon={<span>🏠</span>}
            >
              Trang chủ
            </Button>
          </div>

          {/* Tips */}
          <div className="photo-preview__tips">
            <p className="photo-preview__tip-title">💡 Chia sẻ khoảnh khắc</p>
            <p className="photo-preview__tip-text">
              Tải ảnh về máy và chia sẻ lên Facebook, Instagram, TikTok ngay nhé! 📱
            </p>
          </div>
        </div>
      </div>

      {/* Floating confetti */}
      <div className="photo-preview__confetti">
        {['🎉', '✨', '🌸', '💖', '⭐', '🎊', '🌟'].map((e, i) => (
          <span
            key={i}
            className="photo-preview__confetti-item"
            style={{
              left: `${10 + i * 13}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2.5 + i * 0.4}s`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PhotoPreview;
