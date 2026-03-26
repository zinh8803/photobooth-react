import { apiClient } from './apiClient';
import { ApiResponse, FrameTemplate, FrameCategory, FrameApiResponse } from '../../types';
import { FRAME_TEMPLATES } from '../../data/frames';

// Frame Service - handles frame fetching and filtering
// Currently uses local data, but set up to use API when backend is ready
const USE_LOCAL_DATA = true;

export const frameService = {
  /**
   * Get all available frames
   * @future Calls GET /api/v1/frames
   */
  async getAllFrames(
    page = 1,
    pageSize = 20
  ): Promise<ApiResponse<FrameApiResponse>> {
    if (USE_LOCAL_DATA) {
      const paginated = FRAME_TEMPLATES.slice((page - 1) * pageSize, page * pageSize);
      return {
        data: {
          frames: paginated,
          total: FRAME_TEMPLATES.length,
          page,
          pageSize,
        },
        success: true,
      };
    }

    return apiClient.get<FrameApiResponse>('/frames', {
      page: String(page),
      pageSize: String(pageSize),
    });
  },

  /**
   * Get frames by category
   * @future Calls GET /api/v1/frames?category=xxx
   */
  async getFramesByCategory(
    category: FrameCategory
  ): Promise<ApiResponse<FrameTemplate[]>> {
    if (USE_LOCAL_DATA) {
      const filtered = FRAME_TEMPLATES.filter((f) => f.category === category);
      return { data: filtered, success: true };
    }

    return apiClient.get<FrameTemplate[]>('/frames', { category });
  },

  /**
   * Get a single frame by ID
   * @future Calls GET /api/v1/frames/:id
   */
  async getFrameById(id: string): Promise<ApiResponse<FrameTemplate>> {
    if (USE_LOCAL_DATA) {
      const frame = FRAME_TEMPLATES.find((f) => f.id === id);
      if (frame) {
        return { data: frame, success: true };
      }
      return { data: null as unknown as FrameTemplate, success: false, error: 'Frame not found' };
    }

    return apiClient.get<FrameTemplate>(`/frames/${id}`);
  },

  /**
   * Get trending frames
   * @future Calls GET /api/v1/frames/trending
   */
  async getTrendingFrames(): Promise<ApiResponse<FrameTemplate[]>> {
    if (USE_LOCAL_DATA) {
      const trending = FRAME_TEMPLATES.filter((f) => f.category === 'trending');
      return { data: trending, success: true };
    }

    return apiClient.get<FrameTemplate[]>('/frames/trending');
  },
};
