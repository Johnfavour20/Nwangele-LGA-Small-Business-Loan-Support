import React from 'react';

interface CardProps {
  title: string;
  value: string;
  trend: string;
}

export const Card: React.FC<CardProps> = ({ title, value, trend }) => {
    const isPositive = trend.startsWith('+');
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300 border border-slate-200 dark:border-gray-700">
            <h4 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h4>
            <p className="text-3xl font-bold text-gray-800 dark:text-white my-2">{value}</p>
            <p className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend}
            </p>
        </div>
    );
};