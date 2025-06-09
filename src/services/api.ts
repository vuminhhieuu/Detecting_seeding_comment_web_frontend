const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiComment {
  comment_id: string;
  comment_text: string;
  like_count: number;
  timestamp: string;
  user_id: string;
  prediction?: 0 | 1;
  confidence?: number;
}

export interface ApiAnalysisResult {
  comments: ApiComment[];
  stats: {
    total: number;
    seeding: number;
    not_seeding: number;
    seeding_percentage: number;
  };
  keywords: { [key: string]: number };
  source: string;
  processed_at: string;
  analysis_id?: string;
}

export interface ApiError {
  error: string;
  detail: string;
  timestamp: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    }
  }

  async analyzeUrl(url: string): Promise<ApiAnalysisResult> {
    return this.makeRequest<ApiAnalysisResult>('/predict/url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async analyzeUrls(urls: string[]): Promise<ApiAnalysisResult> {
    return this.makeRequest<ApiAnalysisResult>('/predict/urls', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
  }

  async analyzeFile(file: File): Promise<ApiAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest<ApiAnalysisResult>('/predict/file', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async getStats(): Promise<any> {
    return this.makeRequest<any>('/stats');
  }

  async getHealth(): Promise<any> {
    return this.makeRequest<any>('/health');
  }

  async downloadResults(analysisId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download/${analysisId}`);
    
    if (!response.ok) {
      throw new Error('Không thể tải file kết quả');
    }

    return response.blob();
  }

  generateCSV(comments: ApiComment[]): string {
    const headers = ['comment_id', 'comment_text', 'like_count', 'timestamp', 'user_id', 'prediction', 'confidence'];
    const rows = comments.map(comment => [
      comment.comment_id,
      `"${comment.comment_text.replace(/"/g, '""')}"`,
      comment.like_count,
      comment.timestamp,
      comment.user_id,
      comment.prediction === 1 ? 'Seeding' : 'Not Seeding',
      comment.confidence?.toFixed(3) || '0.000'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const apiService = new ApiService();