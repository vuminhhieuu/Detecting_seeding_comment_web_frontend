export interface Comment {
  comment_id: string;
  comment_text: string;
  like_count: number;
  timestamp: string;
  user_id: string;
  prediction?: 0 | 1;
  confidence?: number;
}

export interface AnalysisResult {
  comments: Comment[];
  stats: {
    total: number;
    seeding: number;
    not_seeding: number;
    seeding_percentage: number;
  };
  keywords: { [key: string]: number };
  source?: string;
  processed_at?: string;
  analysis_id?: string;
}

export interface InputData {
  type: 'url' | 'urls' | 'file';
  data: string | string[] | File;
}

export interface GlobalStats {
  total_analyses: number;
  total_comments_processed: number;
  total_seeding_detected: number;
  average_seeding_rate: number;
  top_seeding_keywords: { [key: string]: number };
  model_accuracy: number;
  last_updated: string;
  recent_activity: Array<{
    analysis_id: string;
    source: string;
    comment_count: number;
    seeding_percentage: number;
    processed_at: string;
  }>;
}