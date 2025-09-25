
import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Pagination } from './Pagination';

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
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        <Button className="w-full sm:w-auto">+ Add New User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left responsive-table">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 font-semibold text-slate-600">Name</th>
              <th className="p-4 font-semibold text-slate-600">Email</th>
              <th className="p-4 font-semibold text-slate-600">Role</th>
              <th className="p-4 font-semibold text-slate-600">Ward</th>
              <th className="p-4 font-semibold text-center text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-slate-50 transition-colors">
                <td data-label="Name" className="p-4 font-medium">{user.name}</td>
                <td data-label="Email" className="p-4 text-slate-600">{user.email}</td>
                <td data-label="Role" className="p-4 badge-cell">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Admin' ? 'bg-green-100 text-green-800' :
                        user.role === 'Loan Officer' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                        {user.role}
                    </span>
                </td>
                <td data-label="Ward" className="p-4 text-slate-600">{user.ward || 'N/A'}</td>
                <td data-label="Actions" className="p-4 text-center actions-cell">
                  <div className="flex items-center justify-end md:justify-center gap-4">
                    <button className="text-green-600 hover:text-green-500 font-semibold text-sm">
                      Edit
                    </button>
                     <button className="text-red-600 hover:text-red-500 font-semibold text-sm">
                      Deactivate
                    </button>
                  </div>
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
