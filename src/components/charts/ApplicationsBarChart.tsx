import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface BarChartProps {
  data: { name: string; applications: number }[];
}

export const ApplicationsBarChart: React.FC<BarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#94a3b8' : '#475569';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0';

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
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.75rem'
            }}
        />
        <Legend wrapperStyle={{ color: tickColor }}/>
        <Bar dataKey="applications" fill="#059669" name="Applications" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};