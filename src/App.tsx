import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, TrendingUp, Github, Wifi, WifiOff } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { Statistics } from './components/Statistics';
import { LoadingSpinner } from './components/LoadingSpinner';
import { apiService } from './services/api';
import { InputData, AnalysisResult } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await apiService.getHealth();
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      console.warn('Backend not available, using mock data');
    }
  };

  const handleAnalysis = async (inputData: InputData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let analysisResult: AnalysisResult;

      if (isOnline) {
        // Use real API
        if (inputData.type === 'url') {
          const apiResult = await apiService.analyzeUrl(inputData.data as string);
          analysisResult = {
            ...apiResult,
            source: inputData.data as string
          };
        } else if (inputData.type === 'urls') {
          const apiResult = await apiService.analyzeUrls(inputData.data as string[]);
          analysisResult = {
            ...apiResult,
            source: `${(inputData.data as string[]).length} URLs`
          };
        } else {
          const apiResult = await apiService.analyzeFile(inputData.data as File);
          analysisResult = {
            ...apiResult,
            source: (inputData.data as File).name
          };
        }
      } else {
        // Fallback to mock service
        const { mockApiService } = await import('./services/mockApi');
        analysisResult = await mockApiService.analyzeComments(
          inputData.type, 
          inputData.data
        );
      }

      setResult(analysisResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TikTok Seeding Detector
                </h1>
                <p className="text-sm text-gray-600">
                  Powered by VisoBERT AI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                isOnline 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'API Connected' : 'Demo Mode'}</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Phân tích bình luận</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Thống kê thời gian thực</span>
                </div>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result && !isLoading && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Phát hiện bình luận seeding với AI
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Sử dụng công nghệ VisoBERT tiên tiến để phân tích và phát hiện các bình luận seeding trên TikTok một cách chính xác và nhanh chóng.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>94.5% độ chính xác</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Hỗ trợ tiếng Việt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Phân tích realtime</span>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <InputForm onSubmit={handleAnalysis} isLoading={isLoading} />

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white/50 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Phân tích thông minh
                </h3>
                <p className="text-gray-600 text-sm">
                  AI VisoBERT được huấn luyện chuyên biệt cho việc phát hiện seeding trong bình luận tiếng Việt
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Báo cáo chi tiết
                </h3>
                <p className="text-gray-600 text-sm">
                  Thống kê đầy đủ với biểu đồ trực quan và khả năng xuất báo cáo CSV
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bảo mật cao
                </h3>
                <p className="text-gray-600 text-sm">
                  Dữ liệu được xử lý an toàn, không lưu trữ thông tin cá nhân của người dùng
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-red-600 mb-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetAnalysis}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={checkBackendConnection}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kiểm tra kết nối
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Kết quả phân tích
                </h2>
                <p className="text-gray-600 mt-1">
                  Phân tích hoàn tất với {result.comments.length} bình luận
                  {result.source && ` từ ${result.source}`}
                </p>
              </div>
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Phân tích mới
              </button>
            </div>

            {/* Statistics */}
            <Statistics result={result} />

            {/* Results Table */}
            <ResultsTable comments={result.comments} analysisId={result.analysis_id} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2024 TikTok Seeding Detector. Powered by VisoBERT AI.
            </p>
            <p className="text-sm">
              Công cụ hỗ trợ phát hiện và phân tích bình luận seeding trên TikTok
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;