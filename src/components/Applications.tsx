import React, { useState, useMemo, useEffect } from 'react';
import type { Applicant } from '../types';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Pagination } from './Pagination';

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
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{isApplicantView ? 'My Loan Applications' : 'All Loan Applications'}</h2>
            {searchTerm && <p className="text-sm text-gray-500 mt-1">Filtered by: "{searchTerm}"</p>}
        </div>
        {isApplicantView && <Button onClick={onStartNewApplication}>+ New Application</Button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-semibold text-gray-600">Applicant ID</th>
              {!isApplicantView && <th className="p-4 font-semibold text-gray-600">Applicant Name</th>}
              <th className="p-4 font-semibold text-gray-600">Business Name</th>
              <th className="p-4 font-semibold text-gray-600">Loan Amount</th>
              <th className="p-4 font-semibold text-gray-600">Application Date</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-center text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.length > 0 ? (
                paginatedApplicants.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-600">{app.id}</td>
                    {!isApplicantView && <td className="p-4 font-medium">{app.name}</td>}
                    <td className="p-4 text-gray-600">{app.businessName}</td>
                    <td className="p-4 font-medium">₦{app.loanAmount.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">{app.applicationDate}</td>
                    <td className="p-4"><Badge status={app.status} /></td>
                    <td className="p-4 text-center">
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
                    <td colSpan={colSpan} className="text-center p-8 text-gray-500">
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