import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { ICONS } from '../constants';

interface BvnVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (bvn: string) => void;
}

const BvnVerificationModal: React.FC<BvnVerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [bvn, setBvn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError('');
    if (!/^\d{11}$/.test(bvn)) {
      setError('BVN must be an 11-digit number.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onVerify(bvn);
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Verify Your Identity</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter your 11-digit Bank Verification Number (BVN) to enhance your Trust Score.</p>
        <div>
          <label htmlFor="bvn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BVN</label>
          <input 
            type="text" 
            id="bvn" 
            value={bvn} 
            onChange={(e) => setBvn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="11-digit number"
            maxLength={11}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBvnVerify: (userId: string) => void;
  setToast: (toast: { message: string, type: 'success' | 'error' } | null) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onBvnVerify, setToast }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    nin: user.nin || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isBvnModalOpen, setBvnModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setToast({ message: 'Invalid file type. Please use JPG, PNG, or GIF.', type: 'error' });
        return;
      }
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setToast({ message: `File is too large. Max size is ${maxSizeInMB}MB.`, type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...user, ...formData, ...(imagePreview && { profilePictureUrl: imagePreview }) });
      setIsSaving(false);
    }, 1500);
  };
  
  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => {
      alert("Password updated successfully! (Simulation)");
      setIsUpdatingPassword(false);
    }, 1500);
  };
  
  const handleVerifyBvn = () => {
      onBvnVerify(user.id);
  }

  const profileCompletion = (user.isBvnVerified ? 35 : 0) + (formData.nin ? 35 : 0) + 30;
  const currentProfilePic = imagePreview || user.profilePictureUrl || `https://i.pravatar.cc/100?u=${user.email}`;

  return (
    <>
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h2>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <h4 className="text-gray-500 dark:text-gray-400 font-medium">Profile Completion</h4>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-3">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">{profileCompletion}% Complete</p>
            {profileCompletion < 100 && <p className="text-xs text-gray-500 mt-1">Provide your NIN and verify BVN to complete your profile.</p>}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Identity Verification</h3>
            {user.isBvnVerified ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg">
                    {ICONS.shieldCheck}
                    <p className="font-semibold text-green-800 dark:text-green-300">Your identity has been successfully verified.</p>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        {ICONS.warning}
                        <p className="text-yellow-800 dark:text-yellow-300">
                            <span className="font-semibold">Verify your identity.</span><br/>
                            <span className="text-sm">This will increase your Trust Score and loan limit.</span>
                        </p>
                    </div>
                    <Button onClick={() => setBvnModalOpen(true)}>Verify with BVN</Button>
                </div>
            )}
        </div>

        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>
                
                <div className="flex items-center gap-6">
                    <img src={currentProfilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-slate-200 dark:border-gray-700"/>
                    <div>
                        <label htmlFor="photo-upload" className="px-4 py-2 rounded-lg font-semibold text-sm bg-green-700 text-white hover:bg-green-800 cursor-pointer transition-colors">
                            Change Photo
                        </label>
                        <input type="file" id="photo-upload" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={isSaving}/>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, PNG, or GIF. 5MB max.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t dark:border-gray-700">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} disabled={isSaving} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} disabled={isSaving} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50" />
                    </div>
                    <div>
                        <label htmlFor="nin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">National Identification Number (NIN)</label>
                        <input type="text" name="nin" id="nin" value={formData.nin} onChange={handleChange} disabled={isSaving} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50" placeholder="Enter your 11-digit NIN"/>
                    </div>
                    <div>
                        <label htmlFor="ward" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward</label>
                        <input type="text" name="ward" id="ward" value={user.ward} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-400 rounded-lg" disabled readOnly />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl text-right">
                <Button type="submit" disabled={isSaving}>{isSaving ? <Spinner size="sm"/> : 'Save Profile'}</Button>
            </div>
        </form>

         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Change Password</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" disabled={isUpdatingPassword} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" disabled={isUpdatingPassword} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50" />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl text-right">
                <Button variant="outline" onClick={handleUpdatePassword} disabled={isUpdatingPassword}>{isUpdatingPassword ? <Spinner size="sm" /> : 'Update Password'}</Button>
            </div>
        </div>
    </div>
    <BvnVerificationModal isOpen={isBvnModalOpen} onClose={() => setBvnModalOpen(false)} onVerify={handleVerifyBvn} />
    </>
  );
};