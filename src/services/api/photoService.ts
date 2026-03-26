import { apiClient } from './apiClient';
import { ApiResponse, UploadPhotoRequest, UploadPhotoResponse, FilterType } from '../../types';

const USE_LOCAL_DATA = true;

export const photoService = {
  /**
   * Upload a photo session to server
   * @future Calls POST /api/v1/photos/upload
   */
  async uploadPhoto(
    request: UploadPhotoRequest
  ): Promise<ApiResponse<UploadPhotoResponse>> {
    if (USE_LOCAL_DATA) {
      // Local only - return mock response
      return {
        data: {
          imageUrl: request.imageDataUrl,
          shareUrl: `https://photo.example.com/share/${Date.now()}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        success: true,
      };
    }

    return apiClient.post<UploadPhotoResponse>('/photos/upload', request);
  },

  /**
   * Download photo to user's device
   * Always works locally - no API needed
   */
  downloadPhoto(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Apply CSS filter string from FilterType
   */
  getFilterString(filter: FilterType): string {
    const filters: Record<FilterType, string> = {
      none: 'none',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(80%)',
      warm: 'saturate(120%) hue-rotate(-10deg) brightness(105%)',
      cool: 'saturate(90%) hue-rotate(10deg) brightness(100%)',
      vivid: 'saturate(160%) contrast(110%)',
      vintage: 'sepia(40%) contrast(90%) brightness(95%) saturate(80%)',
      fade: 'contrast(85%) brightness(110%) saturate(80%)',
    };
    return filters[filter] || 'none';
  },

  /**
   * Get canvas filter value for drawing
   */
  applyFilterToCanvas(
    ctx: CanvasRenderingContext2D,
    filter: FilterType
  ): void {
    ctx.filter = photoService.getFilterString(filter);
  },

  /**
   * Generate filename for download
   */
  generateFilename(prefix = 'photobooth'): string {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('Z')[0];
    return `${prefix}_${timestamp}.jpg`;
  },
};
