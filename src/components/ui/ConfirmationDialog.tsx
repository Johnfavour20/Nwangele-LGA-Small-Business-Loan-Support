import React from 'react';
import { Button } from './Button';
import { ICONS } from '../../constants';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <span className="text-red-600 dark:text-red-400 h-6 w-6">{ICONS.warning}</span>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-gray-100" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full justify-center sm:w-auto bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-3 w-full justify-center sm:mt-0 sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};