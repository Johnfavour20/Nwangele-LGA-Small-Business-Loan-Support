import React from 'react';

interface CardProps {
  title: string;
  value: string;
  trend: string;
}

export const Card: React.FC<CardProps> = ({ title, value, trend }) => {
    const isPositive = trend.startsWith('+') || trend.toLowerCase() === 'healthy';
    const isNeutral = !trend.startsWith('+') && !trend.startsWith('-') && !trend.toLowerCase().includes('healthy');
    
    let trendColor = 'text-gray-500';
    if (!isNeutral) {
        trendColor = isPositive ? 'text-green-600' : 'text-red-600';
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300 border border-slate-200">
            <h4 className="text-gray-500 font-medium">{title}</h4>
            <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>
            <p className={`text-sm font-semibold ${trendColor}`}>
                {trend}
            </p>
        </div>
    );
};