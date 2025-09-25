import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartProps {
  data: { name: string; applications: number }[];
}

export const MonthlyTrendChart: React.FC<ChartProps> = ({ data }) => {
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
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.75rem'
            }}
        />
        <Line type="monotone" dataKey="applications" stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Applications" />
      </LineChart>
    </ResponsiveContainer>
  );
};