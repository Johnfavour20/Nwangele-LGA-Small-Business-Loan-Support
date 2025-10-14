import React from 'react';
import { ICONS } from '../../constants';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText = 'Profile Picture' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 h-10 w-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close image view"
        >
          <span className="h-6 w-6">{ICONS.close}</span>
        </button>
      </div>
    </div>
  );
};