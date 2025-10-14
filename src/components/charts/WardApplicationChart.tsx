import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface ChartProps {
  data: { name: string; applications: number }[];
}

export const WardApplicationChart: React.FC<ChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#4b5563';
  const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
  const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e5e7eb';


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: tickColor }} width={80} />
        <Tooltip 
            cursor={{fill: 'rgba(16, 185, 129, 0.1)'}} 
            contentStyle={{ 
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.75rem'
            }}
        />
        <Bar dataKey="applications" fill="#10B981" name="Applications" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};