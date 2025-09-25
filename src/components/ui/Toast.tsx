import React, { useEffect, useState } from 'react';
import { ICONS } from '../../constants';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: ICONS.checkmark,
    bg: 'bg-green-600',
    text: 'text-white',
  },
  error: {
    icon: ICONS.warning,
    bg: 'bg-red-600',
    text: 'text-white',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Allow time for fade-out animation before calling onClose
            setTimeout(onClose, 300);
        }, 3500); // 3.5s visible time
        
        return () => clearTimeout(timer);
    }, [message, type, onClose]);

    const config = toastConfig[type];

    return (
        <div 
            className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-300 ${config.bg} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            role="alert"
        >
            <div className={`w-6 h-6 mr-3 ${config.text}`}>
                {config.icon}
            </div>
            <p className="font-semibold">{message}</p>
            <button onClick={() => setIsVisible(false)} className="ml-4 -mr-2 p-1.5 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">Close</span>
                <span className={`w-5 h-5 ${config.text}`}>{ICONS.close}</span>
            </button>
        </div>
    );
};
