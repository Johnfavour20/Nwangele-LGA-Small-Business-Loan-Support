import React, { useState, useMemo, useEffect } from 'react';
import type { Applicant } from '../types';
import { UserRole, LoanStatus, BusinessSector } from '../types';
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

const FilterSelect: React.FC<{ label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }> = ({ label, id, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <select id={id} value={value} onChange={onChange} className="w-full sm:w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="All">All</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export const Applications: React.FC<ApplicationsProps> = ({ applicants, onViewProfile, onStartNewApplication, searchTerm }) => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'All'>('All');
  const [sectorFilter, setSectorFilter] = useState<BusinessSector | 'All'>('All');

  const displayedApplicants = useMemo(() => (currentUser?.role === UserRole.Applicant
    ? applicants.filter(a => a.userId === currentUser.id)
    : applicants), [applicants, currentUser]);

  const isApplicantView = currentUser?.role === UserRole.Applicant;

  const filteredApplicants = useMemo(() => displayedApplicants.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.businessName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const matchesSector = sectorFilter === 'All' || app.sector === sectorFilter;
      return matchesSearch && matchesStatus && matchesSector;
    }
  ), [displayedApplicants, searchTerm, statusFilter, sectorFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, statusFilter, sectorFilter]);

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplicants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplicants, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSectorFilter('All');
    // The search term is managed in App.tsx, so we can't clear it here directly.
    // If a prop was provided to clear it, it would be called here.
  };

  const isFilterActive = statusFilter !== 'All' || sectorFilter !== 'All';
  const colSpan = isApplicantView ? 6 : 7;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isApplicantView ? 'My Loan Applications' : 'All Loan Applications'}</h2>
            {searchTerm && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Filtered by: "{searchTerm}"</p>}
        </div>
        {isApplicantView && <Button onClick={onStartNewApplication}>+ New Application</Button>}
      </div>

      {!isApplicantView && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-6 border dark:border-slate-700">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <FilterSelect 
                    label="Status"
                    id="status-filter"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as LoanStatus | 'All')}
                    options={Object.values(LoanStatus)}
                  />
                  <FilterSelect 
                    label="Sector"
                    id="sector-filter"
                    value={sectorFilter}
                    onChange={e => setSectorFilter(e.target.value as BusinessSector | 'All')}
                    options={Object.values(BusinessSector)}
                  />
                  {isFilterActive && (
                      <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
                  )}
              </div>
          </div>
      )}

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
                    {!isApplicantView && <td className="p-4 font-semibold text-slate-800 dark:text-slate-200" data-label="Applicant Name">{app.name}</td>}
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
                        <p>Your search and filter criteria did not match any applications.</p>
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
