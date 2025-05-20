import React from 'react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  iconClassName = '',
}) => {
  return (
    <Card className={`flex items-center ${className}`}>
      <div className={`p-3 rounded-full mr-4 ${iconClassName || 'bg-primary-100 text-primary-600'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center">
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
          
          {trend && (
            <span 
              className={`ml-2 flex items-center text-sm ${
                trend.isPositive ? 'text-success-600' : 'text-danger-600'
              }`}
            >
              <span className="inline-block mr-1">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;