// Types for Photobooth App

export type FilterType =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'warm'
  | 'cool'
  | 'vivid'
  | 'vintage'
  | 'fade';

export type FrameLayout = '1x1' | '2x2' | '3x1' | '4strip';

export type FrameCategory =
  | 'trending'
  | 'cute'
  | 'vintage'
  | 'minimal'
  | 'birthday'
  | 'seasonal';

export interface StickerConfig {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface TextOverlayConfig {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface FrameTemplate {
  id: string;
  name: string;
  nameVi: string;
  layout: FrameLayout;
  category: FrameCategory;
  thumbnail: string;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  cornerRadius: number;
  overlayPattern?: string;
  stickers?: StickerConfig[];
  textOverlay?: TextOverlayConfig;
  photoCount: number;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: Date;
  filter: FilterType;
}

export interface PhotoSession {
  id: string;
  frame: FrameTemplate;
  photos: CapturedPhoto[];
  filter: FilterType;
  createdAt: Date;
}

export interface PhotoBoothState {
  step: 'select-frame' | 'capture' | 'preview' | 'download';
  selectedFrame: FrameTemplate | null;
  capturedPhotos: CapturedPhoto[];
  currentFilter: FilterType;
  countdown: number | null;
  isCapturing: boolean;
  finalImageUrl: string | null;
}

// API types for future scaling
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface UploadPhotoRequest {
  imageDataUrl: string;
  frameId: string;
  filter: FilterType;
}

export interface UploadPhotoResponse {
  imageUrl: string;
  shareUrl: string;
  expiresAt: Date;
}

export interface FrameApiResponse {
  frames: FrameTemplate[];
  total: number;
  page: number;
  pageSize: number;
}
