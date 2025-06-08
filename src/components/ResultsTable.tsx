import React, { useState } from 'react';
import { Download, Filter, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Comment } from '../types';
import { saveAs } from 'file-saver';
import { apiService } from '../services/api';

interface ResultsTableProps {
  comments: Comment[];
  analysisId?: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ comments, analysisId }) => {
  const [filter, setFilter] = useState<'all' | 'seeding' | 'normal'>('all');
  const [showConfidence, setShowConfidence] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const filteredComments = comments.filter(comment => {
    if (filter === 'seeding') return comment.prediction === 1;
    if (filter === 'normal') return comment.prediction === 0;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = async () => {
    try {
      if (analysisId) {
        // Try to download from backend
        const blob = await apiService.downloadResults(analysisId);
        saveAs(blob, `tiktok_analysis_${analysisId}.csv`);
      } else {
        // Fallback to client-side CSV generation
        const csv = apiService.generateCSV(filteredComments);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `tiktok_comments_analysis_${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to client-side generation
      const csv = apiService.generateCSV(filteredComments);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `tiktok_comments_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getPredictionBadge = (prediction: 0 | 1, confidence?: number) => {
    const isSeeding = prediction === 1;
    return (
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isSeeding 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          {isSeeding ? 'Seeding' : 'Bình thường'}
        </span>
        {showConfidence && confidence && (
          <span className={`text-xs px-2 py-1 rounded ${
            confidence > 0.8 ? 'bg-green-100 text-green-700' :
            confidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        )}
      </div>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredComments.length)} 
          trong tổng số {filteredComments.length} bình luận
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + Math.max(1, currentPage - 2);
            if (page > totalPages) return null;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            Kết quả phân tích ({filteredComments.length} bình luận)
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConfidence(!showConfidence)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              {showConfidence ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">Confidence</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Tải CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tất cả', count: comments.length },
              { key: 'seeding', label: 'Seeding', count: comments.filter(c => c.prediction === 1).length },
              { key: 'normal', label: 'Bình thường', count: comments.filter(c => c.prediction === 0).length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key as any);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bình luận
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt thích
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dự đoán
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedComments.map((comment) => (
              <tr 
                key={comment.comment_id}
                className={`hover:bg-gray-50 transition-colors ${
                  comment.prediction === 1 ? 'bg-red-50/50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-sm text-gray-900 line-clamp-3 leading-relaxed">
                      {comment.comment_text}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <p className="text-xs text-gray-500">
                        ID: {comment.user_id}
                      </p>
                      {comment.comment_text.length > 100 && (
                        <button className="text-xs text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem đầy đủ</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 font-medium">
                    {comment.like_count.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {formatDate(comment.timestamp)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPredictionBadge(comment.prediction!, comment.confidence)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination />

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có bình luận nào phù hợp với bộ lọc</p>
        </div>
      )}
    </div>
  );
};