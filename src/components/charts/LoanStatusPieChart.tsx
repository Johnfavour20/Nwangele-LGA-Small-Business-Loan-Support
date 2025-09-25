import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LoanStatus } from '../../types';
import { useTheme } from '../../App';

interface PieChartProps {
  data: { name: string; value: number }[];
}

const COLORS: Record<LoanStatus, string> = {
  [LoanStatus.Pending]: '#FBBF24', // Amber 400
  [LoanStatus.Approved]: '#34D399', // Emerald 400
  [LoanStatus.Rejected]: '#F87171', // Red 400
  [LoanStatus.Disbursed]: '#60A5FA', // Blue 400
  [LoanStatus.Repaid]: '#4ADE80', // Green 400
};

export const LoanStatusPieChart: React.FC<PieChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const legendColor = theme === 'dark' ? '#d1d5db' : '#374151'; // gray-300 vs gray-700

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as LoanStatus] || '#cccccc'} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `${value} applications`} 
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            borderRadius: '0.75rem'
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ color: legendColor, fontSize: '14px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
