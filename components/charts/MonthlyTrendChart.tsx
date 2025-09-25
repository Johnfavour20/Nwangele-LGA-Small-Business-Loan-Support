import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// FIX: Removed useTheme import as it is not exported from App.tsx and the app has no theme context.
// import { useTheme } from '../../App';

interface ChartProps {
  data: { name: string; applications: number }[];
}

export const MonthlyTrendChart: React.FC<ChartProps> = ({ data }) => {
  // FIX: Removed theme logic and hardcoded light theme colors.
  const tickColor = '#4b5563';
  const gridColor = '#e5e7eb';
  const lineColor = '#059669'; // green-700

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
        <Tooltip
            contentStyle={{ 
                // FIX: Hardcoded light theme colors.
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.75rem'
            }}
        />
        <Line type="monotone" dataKey="applications" stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
