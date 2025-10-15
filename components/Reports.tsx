

import React, { useMemo } from 'react';
import type { Applicant, User } from '../types';
import { LoanStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ICONS } from '../constants';
import { WardApplicationChart } from './charts/WardApplicationChart';
import { MonthlyTrendChart } from './charts/MonthlyTrendChart';


interface ReportsProps {
  applicants: Applicant[];
  users: User[];
}

export const Reports: React.FC<ReportsProps> = ({ applicants, users }) => {

  const reportData = useMemo(() => {
    const totalLoanValue = applicants.reduce((sum: number, app) => sum + app.loanAmount, 0);
    const repaidLoans = applicants.filter(app => app.status === LoanStatus.Repaid);
    const disbursedLoans = applicants.filter(app => app.status === LoanStatus.Disbursed || app.status === LoanStatus.Repaid);
    const totalRepaidAmount = repaidLoans.reduce((sum: number, app) => sum + app.loanAmount, 0);
    const totalDisbursedAmount = disbursedLoans.reduce((sum: number, app) => sum + app.loanAmount, 0);
    
    const repaymentRate = totalDisbursedAmount > 0 ? (totalRepaidAmount / totalDisbursedAmount) * 100 : 0;
    
    const userWardMap = new Map(users.map(u => [u.id, u.ward]));
    
    // FIX: Explicitly type the accumulator's initial value to ensure type safety.
    const applicationsByWard = applicants.reduce((acc: Record<string, number>, app) => {
        const ward = userWardMap.get(app.userId) || 'Unknown';
        acc[ward] = (acc[ward] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const wardChartData = Object.entries(applicationsByWard).map(([name, applications]) => ({ name, applications }));

    // FIX: Explicitly type the accumulator's initial value to ensure type safety.
    const applicationsByMonth = applicants.reduce((acc: Record<string, number>, app) => {
        const month = new Date(app.applicationDate).toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    // FIX: Refactored to use Object.entries for better type safety, resolving potential indexing errors.
    const sortedMonthEntries = Object.entries(applicationsByMonth).sort(([a], [b]) => {
        const dateA = new Date(`01 ${a.replace("'", " 20")}`);
        const dateB = new Date(`01 ${b.replace("'", " 20")}`);
        return dateA.getTime() - dateB.getTime();
    });

    const monthChartData = sortedMonthEntries.map(([name, applications]) => ({
        name,
        applications,
    }));

    return {
      totalLoanValue,
      repaymentRate,
      averageLoanAmount: applicants.length > 0 ? totalLoanValue / applicants.length : 0,
      wardChartData,
      monthChartData
    };
  }, [applicants, users]);

  const handleExport = () => {
    // In a real app, this would generate and download a CSV file.
    alert('Exporting data as CSV... (Simulation)');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Reports & Analytics</h2>
        <Button onClick={handleExport} variant="outline">
          {ICONS.export}
          Export to CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Applicants" value={applicants.length.toString()} trend="All-time data" />
        <Card title="Total Loan Value" value={`₦${(reportData.totalLoanValue / 1000000).toFixed(2)}M`} trend="All-time data" />
        <Card title="Average Loan Amount" value={`₦${(reportData.averageLoanAmount / 1000).toFixed(0)}K`} trend="All-time data" />
        <Card title="Repayment Rate" value={`${reportData.repaymentRate.toFixed(1)}%`} trend={reportData.repaymentRate > 75 ? 'Healthy' : 'Needs attention'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-xl font-bold mb-4 text-slate-700">Applications by LGA Ward</h3>
            <div className="h-96">
                <WardApplicationChart data={reportData.wardChartData} />
            </div>
         </div>
         <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-xl font-bold mb-4 text-slate-700">Application Trend</h3>
            <div className="h-96">
                <MonthlyTrendChart data={reportData.monthChartData} />
            </div>
         </div>
      </div>
    </div>
  );
};
