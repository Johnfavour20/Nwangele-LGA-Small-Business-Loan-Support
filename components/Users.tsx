import React from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';

interface UsersProps {
  users: User[];
}

export const Users: React.FC<UsersProps> = ({ users }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">User Management</h2>
        <Button>+ Add New User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Ward</th>
              <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'Admin' ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' :
                        user.role === 'Loan Officer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                        {user.role}
                    </span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{user.ward || 'N/A'}</td>
                <td className="p-4 text-center">
                  <button className="text-green-600 dark:text-green-400 hover:text-green-500 font-semibold text-sm mr-4">
                    Edit
                  </button>
                   <button className="text-red-600 dark:text-red-400 hover:text-red-500 font-semibold text-sm">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};