import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Pagination } from './ui/Pagination';

interface UsersProps {
  users: User[];
}

export const Users: React.FC<UsersProps> = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">User Management</h2>
        <Button>+ Add New User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left responsive-table">
          <thead>
            <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Ward</th>
              <th className="p-4 font-semibold text-center text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-4 font-medium" data-label="Name">{user.name}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400" data-label="Email">{user.email}</td>
                <td className="p-4" data-label="Role">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Admin' ? 'bg-green-100 text-green-800' :
                        user.role === 'Loan Officer' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                        {user.role}
                    </span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400" data-label="Ward">{user.ward || 'N/A'}</td>
                <td className="p-4 text-center actions-cell" data-label="Actions">
                  <button className="text-green-600 hover:text-green-500 font-semibold text-sm mr-4">
                    Edit
                  </button>
                   <button className="text-red-600 hover:text-red-500 font-semibold text-sm">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};
