import React, { useMemo } from 'react'
import { FaTrendUp, FaTrendDown, FaMinus, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import { getTaskTrend } from '@/lib/utils/getTaskTrends'

const TaskTrendsCard = ({ projectTasks = [], isLoading = false }) => {
  const trendData = useMemo(() => {
    if (!projectTasks?.length) return null;
    
    const rawTrend = getTaskTrend(projectTasks);
    
    // Convert to array of last 7 days with data
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      last7Days.push({
        date: dateStr,
        dayName,
        count: rawTrend[dateStr] || 0,
        fullDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    // Calculate trend direction
    const firstHalf = last7Days.slice(0, 3);
    const secondHalf = last7Days.slice(4, 7);
    
    const firstAvg = firstHalf.reduce((sum, day) => sum + day.count, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, day) => sum + day.count, 0) / secondHalf.length;
    
    let trend = 'stable';
    let changePercentage = 0;
    
    if (firstAvg > 0) {
      changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
      if (changePercentage > 10) trend = 'up';
      else if (changePercentage < -10) trend = 'down';
    } else if (secondAvg > 0) {
      trend = 'up';
      changePercentage = 100;
    }
    
    const totalTasks = last7Days.reduce((sum, day) => sum + day.count, 0);
    const avgPerDay = totalTasks / 7;
    
    return {
      chartData: last7Days,
      trend,
      changePercentage: Math.abs(changePercentage),
      totalCompleted: totalTasks,
      avgPerDay,
      firstAvg,
      secondAvg
    };
  }, [projectTasks]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading chart skeleton */}
        <div className="mb-6">
          <div className="flex items-end gap-2 h-40 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse" 
                     style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!trendData || trendData.totalCompleted === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <FaChartLine className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Completion Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              7-day completion analysis
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No completed tasks yet
          </h4>
          <p className="text-gray-500 dark:text-gray-500">
            Complete some tasks to see completion trends
          </p>
        </div>
      </div>
    );
  }

  const { chartData, trend, changePercentage, totalCompleted, avgPerDay } = trendData;
  const maxValue = Math.max(...chartData.map(d => d.count));

  const getTrendIcon = () => {
    if (trend === 'up') return <FaTrendUp className="text-green-500" />;
    if (trend === 'down') return <FaTrendDown className="text-red-500" />;
    return <FaMinus className="text-gray-500" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendBgColor = () => {
    if (trend === 'up') return 'bg-green-50 dark:bg-green-900/20';
    if (trend === 'down') return 'bg-red-50 dark:bg-red-900/20';
    return 'bg-gray-50 dark:bg-gray-700/30';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <FaChartLine className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task Completion Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Last 7 days performance
            </p>
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className={`px-3 py-1 rounded-full ${getTrendBgColor()}`}>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trend === 'up' && 'Trending Up'}
              {trend === 'down' && 'Trending Down'}
              {trend === 'stable' && 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-end gap-2 h-40 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          {chartData.map((day, index) => {
            const height = maxValue > 0 ? (day.count / maxValue) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative group">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-300 hover:from-purple-700 hover:to-purple-500 cursor-pointer"
                    style={{ 
                      height: `${Math.max(height, 4)}px`,
                      minHeight: day.count > 0 ? '4px' : '2px'
                    }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      <div className="font-medium">{day.fullDate}</div>
                      <div>{day.count} tasks completed</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </div>
                
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {day.dayName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {day.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalCompleted}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Completed
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {avgPerDay.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Avg per Day
          </div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {changePercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Change
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {Math.max(...chartData.map(d => d.count))}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Peak Day
          </div>
        </div>
      </div>

      {/* Trend analysis */}
      <div className={`p-3 rounded-lg ${getTrendBgColor()}`}>
        <div className="flex items-center gap-2 text-sm">
          {getTrendIcon()}
          <span className={`font-medium ${getTrendColor()}`}>
            {trend === 'up' && `Productivity increased by ${changePercentage.toFixed(1)}% this week`}
            {trend === 'down' && `Productivity decreased by ${changePercentage.toFixed(1)}% this week`}
            {trend === 'stable' && 'Productivity remains consistent this week'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskTrendsCard