import React from 'react';
import { Loader2, Brain, Search, BarChart3 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  const steps = [
    { icon: Search, text: 'Đang thu thập bình luận...', delay: 0 },
    { icon: Brain, text: 'Phân tích bằng AI VisoBERT...', delay: 1000 },
    { icon: BarChart3, text: 'Tạo thống kê và báo cáo...', delay: 2000 },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const intervals = steps.map((step, index) => {
      return setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-white/20 text-center">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-8">
        Đang xử lý dữ liệu
      </h3>

      <div className="space-y-6 max-w-md mx-auto">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                isActive 
                  ? 'bg-blue-50 border-2 border-blue-200 scale-105' 
                  : isCompleted
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`font-medium ${
                isActive 
                  ? 'text-blue-700' 
                  : isCompleted
                  ? 'text-green-700'
                  : 'text-gray-500'
              }`}>
                {step.text}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>Quá trình này có thể mất 1-2 phút tùy thuộc vào số lượng bình luận</p>
      </div>
    </div>
  );
};