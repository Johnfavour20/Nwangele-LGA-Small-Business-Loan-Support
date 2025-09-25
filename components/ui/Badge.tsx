import React from 'react';
import { LoanStatus } from '../../types';

interface BadgeProps {
  status: LoanStatus;
}

const statusStyles: Record<LoanStatus, string> = {
  [LoanStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [LoanStatus.Approved]: 'bg-green-100 text-green-800',
  [LoanStatus.Rejected]: 'bg-red-100 text-red-800',
  [LoanStatus.Disbursed]: 'bg-blue-100 text-blue-800',
  [LoanStatus.Repaid]: 'bg-indigo-100 text-indigo-800',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};