import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { TrendingUp, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface StatisticsProps {
  result: AnalysisResult;
}

export const Statistics: React.FC<StatisticsProps> = ({ result }) => {
  const { stats, keywords } = result;

  const doughnutData = {
    labels: ['Seeding', 'Bình thường'],
    datasets: [
      {
        data: [stats.seeding, stats.not_seeding],
        backgroundColor: ['#EF4444', '#10B981'],
        borderColor: ['#DC2626', '#059669'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  const keywordEntries = Object.entries(keywords).sort(([,a], [,b]) => b - a).slice(0, 10);
  const barData = {
    labels: keywordEntries.map(([keyword]) => keyword),
    datasets: [
      {
        label: 'Tần suất xuất hiện',
        data: keywordEntries.map(([, count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Từ khóa phổ biến trong bình luận seeding',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const statCards = [
    {
      title: 'Tổng bình luận',
      value: stats.total,
      icon: MessageCircle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Bình luận seeding',
      value: stats.seeding,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      title: 'Bình luận bình thường',
      value: stats.not_seeding,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      title: 'Tỷ lệ seeding',
      value: `${stats.seeding_percentage}%`,
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor} border border-white/30`}>
                  <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Phân bố bình luận
          </h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Phân tích chi tiết
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Mức độ rủi ro</h4>
            <div className="space-y-2">
              {stats.seeding_percentage > 30 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Tỷ lệ seeding cao - cần chú ý</span>
                </div>
              )}
              {stats.seeding_percentage <= 30 && stats.seeding_percentage > 10 && (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Tỷ lệ seeding trung bình</span>
                </div>
              )}
              {stats.seeding_percentage <= 10 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Tỷ lệ seeding thấp - tốt</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Khuyến nghị</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Theo dõi các từ khóa seeding phổ biến</li>
              <li>• Kiểm tra profile các tài khoản có bình luận seeding</li>
              <li>• Xem xét báo cáo nếu tỷ lệ seeding cao</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};