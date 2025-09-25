import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: { name: string; applications: number }[];
}

export const ApplicationsBarChart: React.FC<BarChartProps> = ({ data }) => {
  const tickColor = '#4b5563'; // gray-600
  const gridColor = '#e5e7eb'; // gray-200

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
        <YAxis allowDecimals={false} tick={{ fill: tickColor }} />
        <Tooltip 
            cursor={{fill: 'rgba(110, 231, 183, 0.1)'}} 
            contentStyle={{ 
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.75rem'
            }}
        />
        <Legend wrapperStyle={{ color: tickColor }}/>
        <Bar dataKey="applications" fill="#059669" name="Applications" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};