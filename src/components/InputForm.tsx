import React, { useState } from 'react';
import { Upload, Link, FileText, Loader2, AlertCircle } from 'lucide-react';
import { InputData } from '../types';

interface InputFormProps {
  onSubmit: (data: InputData) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'urls' | 'file'>('url');
  const [singleUrl, setSingleUrl] = useState('');
  const [multipleUrls, setMultipleUrls] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTikTokUrl = (url: string): boolean => {
    const tiktokPattern = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)/i;
    return tiktokPattern.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (activeTab === 'url' && singleUrl.trim()) {
      if (!validateTikTokUrl(singleUrl.trim())) {
        setValidationError('Vui lòng nhập URL TikTok hợp lệ');
        return;
      }
      onSubmit({ type: 'url', data: singleUrl.trim() });
    } else if (activeTab === 'urls' && multipleUrls.trim()) {
      const urls = multipleUrls.split('\n').filter(url => url.trim());
      
      // Validate all URLs
      const invalidUrls = urls.filter(url => !validateTikTokUrl(url.trim()));
      if (invalidUrls.length > 0) {
        setValidationError(`URL không hợp lệ: ${invalidUrls[0]}`);
        return;
      }
      
      if (urls.length > 10) {
        setValidationError('Tối đa 10 URL mỗi lần phân tích');
        return;
      }
      
      onSubmit({ type: 'urls', data: urls.map(url => url.trim()) });
    } else if (activeTab === 'file' && file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('File quá lớn. Tối đa 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['.json', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setValidationError('Chỉ hỗ trợ file JSON và CSV');
        return;
      }
      
      onSubmit({ type: 'file', data: file });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationError(null);
    }
  };

  const tabClass = (tab: string) => 
    `px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
      activeTab === tab 
        ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
        : 'bg-white/20 text-blue-700 hover:bg-white/30 hover:scale-102'
    }`;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Phân tích bình luận TikTok</h2>
        <p className="text-gray-600">Chọn phương thức nhập dữ liệu để bắt đầu phân tích</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 bg-blue-50 p-2 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={tabClass('url')}
        >
          <Link className="w-4 h-4 inline mr-2" />
          Một URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('urls')}
          className={tabClass('urls')}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Nhiều URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={tabClass('file')}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Tải file
        </button>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'url' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Link video TikTok
            </label>
            <input
              type="url"
              value={singleUrl}
              onChange={(e) => {
                setSingleUrl(e.target.value);
                setValidationError(null);
              }}
              placeholder="https://www.tiktok.com/@username/video/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-gray-500">
              Ví dụ: https://www.tiktok.com/@username/video/1234567890
            </p>
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Danh sách URL (mỗi URL một dòng, tối đa 10 URL)
            </label>
            <textarea
              value={multipleUrls}
              onChange={(e) => {
                setMultipleUrls(e.target.value);
                setValidationError(null);
              }}
              placeholder="https://www.tiktok.com/@user1/video/123&#10;https://www.tiktok.com/@user2/video/456"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-gray-500">
              Nhập mỗi URL trên một dòng riêng biệt
            </p>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Tải file JSON hoặc CSV (tối đa 10MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Chọn file để tải lên
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Hỗ trợ định dạng JSON và CSV
              </p>
              {file && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Đã chọn: {file.name}
                  </p>
                  <p className="text-xs text-green-500">
                    Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Định dạng file yêu cầu:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>JSON:</strong> Array of objects với các trường: comment_id, comment_text, like_count, timestamp, user_id</p>
                <p><strong>CSV:</strong> Header row với các cột tương ứng</p>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                <p>{'Ví dụ JSON: [{"comment_id": "1", "comment_text": "Hay quá!", "like_count": 10, ...}]'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              Đang phân tích...
            </>
          ) : (
            'Bắt đầu phân tích'
          )}
        </button>
      </form>
    </div>
  );
};