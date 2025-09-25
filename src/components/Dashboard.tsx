import React, { useMemo } from 'react';
import { LoanStatus, BusinessSector, UserRole } from '../types';
import type { Applicant, User } from '../types';
import { useAuth } from '../App';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { LoanStatusPieChart } from './charts/LoanStatusPieChart';
import { ApplicationsBarChart } from './charts/ApplicationsBarChart';

interface DashboardProps {
  onViewProfile: (applicant: Applicant) => void;
  onStartNewApplication: () => void;
  searchTerm: string;
  applicants: Applicant[];
  users: User[];
}

const AdminDashboard: React.FC<Omit<DashboardProps, 'onStartNewApplication'>> = ({ onViewProfile, searchTerm, applicants }) => {
    const totalApplications = applicants.length;
    const totalDisbursed = applicants
        .filter(a => a.status === LoanStatus.Disbursed || a.status === LoanStatus.Repaid)
        .reduce((sum, a) => sum + a.loanAmount, 0);
    const pendingApplications = applicants.filter(a => a.status === LoanStatus.Pending).length;
    const approvedApplications = applicants.filter(a => a.status === LoanStatus.Approved).length;

    const statusCounts = applicants.reduce((acc: Record<LoanStatus, number>, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<LoanStatus, number>);

    const pieChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    
    const sectorCounts = applicants.reduce((acc: Record<BusinessSector, number>, app) => {
        acc[app.sector] = (acc[app.sector] || 0) + 1;
        return acc;
    }, {} as Record<BusinessSector, number>);

    const barChartData = Object.entries(sectorCounts).map(([name, value]) => ({ name, applications: value }));

    const recentApplications = [...applicants]
        .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
        .slice(0, 5);

    const filteredRecentApplications = recentApplications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Applications" value={totalApplications.toString()} trend="+5% this month" />
                <Card title="Amount Disbursed" value={`₦${(totalDisbursed / 1000000).toFixed(2)}M`} trend="+12% this month" />
                <Card title="Pending Review" value={pendingApplications.toString()} trend="-2% this month" />
                <Card title="Approved" value={approvedApplications.toString()} trend="+8% this month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Applications by Sector</h3>
                    <div className="h-80">
                      <ApplicationsBarChart data={barChartData} />
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Loan Status Overview</h3>
                     <div className="h-80">
                      <LoanStatusPieChart data={pieChartData} />
                    </div>
                </div>
            </div>

             <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Recent Applications</h3>
                <p className="text-gray-500 text-sm mb-4">Showing the 5 most recent applications across the entire system. {searchTerm && `Filtered by "${searchTerm}".`}</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="p-3 font-semibold text-gray-600">Applicant Name</th>
                                <th className="p-3 font-semibold text-gray-600">Business Name</th>
                                <th className="p-3 font-semibold text-gray-600">Amount</th>
                                <th className="p-3 font-semibold text-gray-600">Date</th>
                                <th className="p-3 font-semibold text-gray-600">Status</th>
                                <th className="p-3 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecentApplications.length > 0 ? (
                                filteredRecentApplications.map(app => (
                                    <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3">{app.name}</td>
                                        <td className="p-3 text-gray-600">{app.businessName}</td>
                                        <td className="p-3 font-medium">₦{app.loanAmount.toLocaleString()}</td>
                                        <td className="p-3 text-gray-600">{app.applicationDate}</td>
                                        <td className="p-3"><Badge status={app.status} /></td>
                                        <td className="p-3">
                                            <button onClick={() => onViewProfile(app)} className="text-green-600 hover:text-green-500 font-semibold flex items-center">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">
                                        No recent applications found for "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ApplicantDashboard: React.FC<DashboardProps> = ({ onViewProfile, onStartNewApplication, searchTerm, applicants }) => {
    const { currentUser } = useAuth();
    const myApps = applicants.filter(app => app.userId === currentUser?.id);
    
    const filteredMyApps = myApps.filter(app =>
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeLoan = myApps.find(a => a.status === LoanStatus.Disbursed);
    
    const trustScore = useMemo(() => {
        if (!currentUser) return 0;
        let score = 30; // Base score
        if (currentUser?.isBvnVerified) score += 35;
        if (currentUser.nin) score += 20;
        const hasRepaidLoan = myApps.some(app => app.status === LoanStatus.Repaid);
        if (hasRepaidLoan) score += 15;
        return Math.min(score, 100);
    }, [currentUser, myApps]);

    const loanLimit = trustScore * 15000;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {currentUser?.name}!</h2>
                <p className="text-gray-600">Here's a summary of your loan applications and profile status.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Active Loan" value={activeLoan ? `₦${activeLoan.loanAmount.toLocaleString()}`: 'None'} trend={activeLoan?.status || 'No active loan'} />
                 <div className="md:col-span-2 bg-green-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center">
                    <h4 className="font-medium text-green-200">Your Pre-qualified Loan Limit</h4>
                    <p className="text-4xl font-bold my-2">₦{loanLimit.toLocaleString()}</p>
                    <p className="text-sm text-green-200">Based on your Trust Score of {trustScore}. Improve your score by verifying your BVN.</p>
                 </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-700">My Applications</h3>
                    <Button onClick={onStartNewApplication}>+ Start New Application</Button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 font-semibold text-gray-600">Application ID</th>
                                <th className="p-3 font-semibold text-gray-600">Business Name</th>
                                <th className="p-3 font-semibold text-gray-600">Amount</th>
                                <th className="p-3 font-semibold text-gray-600">Date</th>
                                <th className="p-3 font-semibold text-gray-600">Status</th>
                                <th className="p-3 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                             {filteredMyApps.length > 0 ? (
                                filteredMyApps.map(app => (
                                    <tr key={app.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-mono text-sm">{app.id}</td>
                                        <td className="p-3 text-gray-600">{app.businessName}</td>
                                        <td className="p-3 font-medium">₦{app.loanAmount.toLocaleString()}</td>
                                        <td className="p-3 text-gray-600">{app.applicationDate}</td>
                                        <td className="p-3"><Badge status={app.status} /></td>
                                        <td className="p-3">
                                            <button onClick={() => onViewProfile(app)} className="text-green-600 hover:text-green-500 font-semibold">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">
                                       No applications found.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
    const { currentUser } = useAuth();
    const isAdminOrOfficer = currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.Officer;

    if (isAdminOrOfficer) {
        return <AdminDashboard {...props} />;
    }
    
    return <ApplicantDashboard {...props} />;
};