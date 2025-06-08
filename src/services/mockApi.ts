import { Comment, AnalysisResult } from '../types';

// Mock data cho demo
const mockComments: Comment[] = [
  {
    comment_id: '1',
    comment_text: 'Sản phẩm này tuyệt vời quá! Tôi đã mua và rất hài lòng. Bạn nào cần thì inbox shop nhé!',
    like_count: 45,
    timestamp: '2024-01-15T10:30:00Z',
    user_id: 'user123',
    prediction: 1,
    confidence: 0.92
  },
  {
    comment_id: '2',
    comment_text: 'Video hay quá! Cảm ơn bạn đã chia sẻ',
    like_count: 12,
    timestamp: '2024-01-15T11:15:00Z',
    user_id: 'user456',
    prediction: 0,
    confidence: 0.78
  },
  {
    comment_id: '3',
    comment_text: 'Shop này uy tín lắm các bạn ơi! Tôi đã mua nhiều lần rồi, chất lượng đảm bảo 100%',
    like_count: 89,
    timestamp: '2024-01-15T12:00:00Z',
    user_id: 'user789',
    prediction: 1,
    confidence: 0.96
  },
  {
    comment_id: '4',
    comment_text: 'Âm nhạc trong video này hay quá!',
    like_count: 23,
    timestamp: '2024-01-15T13:20:00Z',
    user_id: 'user101',
    prediction: 0,
    confidence: 0.85
  },
  {
    comment_id: '5',
    comment_text: 'Link mua ở đâu vậy admin? Inbox em với ạ! Cần gấp quá',
    like_count: 67,
    timestamp: '2024-01-15T14:45:00Z',
    user_id: 'user202',
    prediction: 1,
    confidence: 0.89
  },
  {
    comment_id: '6',
    comment_text: 'Haha clip này vui ghê!',
    like_count: 8,
    timestamp: '2024-01-15T15:10:00Z',
    user_id: 'user303',
    prediction: 0,
    confidence: 0.72
  }
];

const seedingKeywords = {
  'shop': 15,
  'mua': 12,
  'uy tín': 8,
  'chất lượng': 6,
  'inbox': 10,
  'link': 7,
  'sản phẩm': 9,
  'đảm bảo': 5,
  'gấp': 4,
  'admin': 6
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  async analyzeComments(inputType: string, data: any): Promise<AnalysisResult> {
    await delay(2000); // Simulate processing time
    
    let comments = [...mockComments];
    
    // If file input, try to parse and use provided data
    if (inputType === 'file' && Array.isArray(data)) {
      comments = data.map((comment: any, index: number) => ({
        ...comment,
        comment_id: comment.comment_id || `imported_${index}`,
        prediction: Math.random() > 0.6 ? 1 : 0,
        confidence: 0.7 + Math.random() * 0.3
      }));
    }
    
    // Add some randomization for URLs
    if (inputType === 'url' || inputType === 'urls') {
      comments = comments.map(comment => ({
        ...comment,
        prediction: Math.random() > 0.5 ? 1 : 0,
        confidence: 0.7 + Math.random() * 0.3
      }));
    }
    
    const seedingCount = comments.filter(c => c.prediction === 1).length;
    const totalCount = comments.length;
    
    return {
      comments,
      stats: {
        total: totalCount,
        seeding: seedingCount,
        not_seeding: totalCount - seedingCount,
        seeding_percentage: Math.round((seedingCount / totalCount) * 100)
      },
      keywords: seedingKeywords
    };
  },

  async getStats(): Promise<any> {
    await delay(500);
    return {
      total_processed: 1250,
      seeding_detected: 312,
      accuracy: 94.5,
      last_updated: new Date().toISOString()
    };
  },

  generateCSV(comments: Comment[]): string {
    const headers = ['comment_id', 'comment_text', 'like_count', 'timestamp', 'user_id', 'prediction', 'confidence'];
    const rows = comments.map(comment => [
      comment.comment_id,
      `"${comment.comment_text.replace(/"/g, '""')}"`,
      comment.like_count,
      comment.timestamp,
      comment.user_id,
      comment.prediction === 1 ? 'Seeding' : 'Not Seeding',
      comment.confidence?.toFixed(2) || '0.00'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
};