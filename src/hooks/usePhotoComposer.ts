import { useCallback } from 'react';
import { FrameTemplate, CapturedPhoto } from '../types';

const FRAME_PADDING = 20;
const PHOTO_GAP = 10;
const BOTTOM_BAR_HEIGHT = 44;
const STICKER_SCALE = 1;

function hexToRgba(hex: string, alpha = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function usePhotoComposer() {
  const composePhoto = useCallback(
    async (frame: FrameTemplate, photos: CapturedPhoto[]): Promise<string> => {
      return new Promise((resolve, reject) => {
        try {
          const layout = frame.layout;
          let cols = 1;
          let rows = 1;

          if (layout === '4strip') {
            cols = 1;
            rows = 4;
          } else if (layout === '2x2') {
            cols = 2;
            rows = 2;
          } else if (layout === '3x1') {
            cols = 1;
            rows = 3;
          } else if (layout === '1x1') {
            cols = 1;
            rows = 1;
          }

          // Canvas dimensions
          const photoW = 320;
          const photoH = 240;
          const canvasW =
            FRAME_PADDING * 2 +
            cols * photoW +
            (cols - 1) * PHOTO_GAP +
            frame.borderWidth * 2;
          const canvasH =
            FRAME_PADDING * 2 +
            rows * photoH +
            (rows - 1) * PHOTO_GAP +
            BOTTOM_BAR_HEIGHT +
            frame.borderWidth * 2;

          const canvas = document.createElement('canvas');
          canvas.width = canvasW;
          canvas.height = canvasH;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas not supported');

          // Background
          ctx.fillStyle = frame.backgroundColor;
          ctx.roundRect(0, 0, canvasW, canvasH, frame.cornerRadius);
          ctx.fill();

          // Border
          if (frame.borderWidth > 0) {
            ctx.strokeStyle = frame.borderColor;
            ctx.lineWidth = frame.borderWidth;
            ctx.roundRect(
              frame.borderWidth / 2,
              frame.borderWidth / 2,
              canvasW - frame.borderWidth,
              canvasH - frame.borderWidth,
              frame.cornerRadius
            );
            ctx.stroke();
          }

          // Draw photos
          const loadPromises = photos.slice(0, frame.photoCount).map((photo, i) => {
            return new Promise<void>((res) => {
              const img = new Image();
              img.onload = () => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x =
                  frame.borderWidth + FRAME_PADDING + col * (photoW + PHOTO_GAP);
                const y =
                  frame.borderWidth + FRAME_PADDING + row * (photoH + PHOTO_GAP);

                // Clip to rounded rect for photo
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, photoW, photoH, 8);
                ctx.clip();

                // Fit image into photo slot
                const sx = 0, sy = 0, sw = img.width, sh = img.height;
                const scale = Math.max(photoW / sw, photoH / sh);
                const dw = sw * scale;
                const dh = sh * scale;
                const dx = x + (photoW - dw) / 2;
                const dy = y + (photoH - dh) / 2;

                ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                ctx.restore();
                res();
              };
              img.onerror = () => res();
              img.src = photo.dataUrl;
            });
          });

          Promise.all(loadPromises).then(() => {
            // Draw stickers
            if (frame.stickers) {
              for (const sticker of frame.stickers) {
                ctx.save();
                const sx = sticker.x * canvasW;
                const sy = sticker.y * canvasH;
                ctx.font = `${sticker.size * STICKER_SCALE}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.translate(sx, sy);
                ctx.rotate((sticker.rotation * Math.PI) / 180);
                ctx.fillText(sticker.emoji, 0, 0);
                ctx.restore();
              }
            }

            // Bottom text bar
            if (frame.textOverlay) {
              const t = frame.textOverlay;
              const tx = t.x * canvasW;
              const ty = canvasH - BOTTOM_BAR_HEIGHT / 2;
              ctx.font = `bold ${t.fontSize}px ${t.fontFamily}`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = t.color;
              ctx.fillText(t.text, tx, ty);
            }

            // Date stamp
            const now = new Date();
            const dateStr = now.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = hexToRgba(frame.borderColor, 0.6);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(dateStr, canvasW - frame.borderWidth - 8, canvasH - frame.borderWidth - 4);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    []
  );

  return { composePhoto };
}
