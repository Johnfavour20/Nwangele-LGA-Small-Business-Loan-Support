import React, { useState, useMemo, useEffect } from 'react';
import type { Applicant } from '../types';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Pagination } from './ui/Pagination';

interface ApplicationsProps {
  applicants: Applicant[];
  onViewProfile: (applicant: Applicant) => void;
  onStartNewApplication: () => void;
  searchTerm: string;
}

export const Applications: React.FC<ApplicationsProps> = ({ applicants, onViewProfile, onStartNewApplication, searchTerm }) => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const displayedApplicants = useMemo(() => (currentUser?.role === UserRole.Applicant
    ? applicants.filter(a => a.userId === currentUser.id)
    : applicants), [applicants, currentUser]);

  const isApplicantView = currentUser?.role === UserRole.Applicant;

  const filteredApplicants = useMemo(() => displayedApplicants.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  ), [displayedApplicants, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplicants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplicants, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const colSpan = isApplicantView ? 6 : 7;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isApplicantView ? 'My Loan Applications' : 'All Loan Applications'}</h2>
            {searchTerm && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Filtered by: "{searchTerm}"</p>}
        </div>
        {isApplicantView && <Button onClick={onStartNewApplication}>+ New Application</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left responsive-table">
          <thead>
            <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Applicant ID</th>
              {!isApplicantView && <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Applicant Name</th>}
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Business Name</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Loan Amount</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Application Date</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="p-4 font-semibold text-center text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.length > 0 ? (
                paginatedApplicants.map((app) => (
                  <tr key={app.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400" data-label="Application ID">{app.id}</td>
                    {!isApplicantView && <td className="p-4 font-medium" data-label="Applicant Name">{app.name}</td>}
                    <td className="p-4 text-slate-600 dark:text-slate-400" data-label="Business Name">{app.businessName}</td>
                    <td className="p-4 font-medium" data-label="Loan Amount">₦{app.loanAmount.toLocaleString()}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400" data-label="Application Date">{app.applicationDate}</td>
                    <td className="p-4" data-label="Status"><Badge status={app.status} /></td>
                    <td className="p-4 text-center actions-cell" data-label="Actions">
                      <button
                        onClick={() => onViewProfile(app)}
                        className="text-green-600 hover:text-green-500 font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={colSpan} className="text-center p-8 text-slate-500 dark:text-slate-400">
                        <h3 className="text-lg font-semibold">No Applications Found</h3>
                        <p>Your search for "{searchTerm}" did not match any applications.</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={filteredApplicants.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};