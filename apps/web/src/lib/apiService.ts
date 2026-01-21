// API service for backend API on Render
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_BASE_URL || 'https://your-render-backend.onrender.com'
  : 'http://localhost:3000';

const API_SECRET_KEY = process.env.VITE_API_SECRET_KEY;

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_SECRET_KEY}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Trigger Google Fit data sync for all connected users
   */
  async syncGoogleFitData(): Promise<ApiResponse> {
    return this.makeRequest('/sync-google-fit', {
      method: 'POST',
    });
  }

  /**
   * Update monthly leaderboards
   */
  async updateLeaderboards(month: string, year: number): Promise<ApiResponse> {
    return this.makeRequest('/update-leaderboards', {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
  }

  /**
   * Update current month's leaderboard
   */
  async updateCurrentMonthLeaderboard(): Promise<ApiResponse> {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    
    return this.updateLeaderboards(month, year);
  }
}

export const apiService = new ApiService();

// Export individual functions for easier use
export const syncGoogleFitData = () => apiService.syncGoogleFitData();
export const updateLeaderboards = (month: string, year: number) => 
  apiService.updateLeaderboards(month, year);
export const updateCurrentMonthLeaderboard = () => 
  apiService.updateCurrentMonthLeaderboard();
