import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { ICONS } from '../constants';
import { ImageModal } from './ui/ImageModal';
import { blobToBase64 } from '../utils/file';

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    nin: user.nin || '',
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(user.profilePictureUrl || null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isBvnVerifying, setIsBvnVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      setProfilePicture(base64);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData, profilePictureUrl: profilePicture || undefined });
  };
  
  const handleBvnVerification = () => {
      setIsBvnVerifying(true);
      // Simulate API call
      setTimeout(() => {
          onUpdateUser({ ...user, isBvnVerified: true });
          setIsBvnVerifying(false);
      }, 2000);
  }

  const profileCompletion = (user.nin ? 50 : 0) + (user.isBvnVerified ? 50 : 0);

  const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";


  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Profile</h2>

          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h4 className="text-slate-500 dark:text-slate-400 font-medium">Profile Completion</h4>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 my-3">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${profileCompletion}%`}}></div>
              </div>
              <p className="text-sm font-semibold text-green-600">{profileCompletion}% Complete</p>
              {profileCompletion < 100 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Provide your NIN and verify your BVN to complete your profile.</p>}
          </div>

          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-6">
                      <div className="relative group">
                          <img 
                              src={profilePicture || `https://i.pravatar.cc/128?u=${user.email}`} 
                              alt="Profile" 
                              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 cursor-pointer"
                              onClick={() => profilePicture && setImageModalOpen(true)}
                          />
                          <label htmlFor="profile-picture-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="h-8 w-8">{ICONS.upload}</span>
                              <input type="file" id="profile-picture-upload" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{formData.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t dark:border-slate-700">
                      <div>
                          <label htmlFor="name" className={labelClasses}>Full Name</label>
                          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} />
                      </div>
                      <div>
                          <label htmlFor="email" className={labelClasses}>Email Address</label>
                          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClasses} />
                      </div>
                      <div>
                          <label htmlFor="nin" className={labelClasses}>National Identification Number (NIN)</label>
                          <input type="text" name="nin" id="nin" value={formData.nin} onChange={handleChange} className={inputClasses} placeholder="Enter your 11-digit NIN"/>
                      </div>
                      <div>
                          <label htmlFor="ward" className={labelClasses}>Ward</label>
                          <input type="text" name="ward" id="ward" value={user.ward} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 rounded-lg" disabled readOnly />
                      </div>
                  </div>
                   <div className="pt-6 border-t dark:border-slate-700">
                       <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100">Identity Verification</h4>
                       <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Bank Verification Number (BVN)</p>
                            {user.isBvnVerified ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mt-2 sm:mt-0">
                                    <span className="h-5 w-5">{ICONS.shieldCheck}</span>
                                    Verified
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleBvnVerification}
                                    variant="outline"
                                    isLoading={isBvnVerifying}
                                    className="mt-2 sm:mt-0"
                                >
                                    Verify with BVN
                                </Button>
                            )}
                       </div>
                   </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 rounded-b-xl text-right">
                  <Button type="submit">Save Changes</Button>
              </div>
          </form>
      </div>
      {profilePicture && (
        <ImageModal 
            isOpen={isImageModalOpen}
            onClose={() => setImageModalOpen(false)}
            imageUrl={profilePicture}
        />
      )}
    </>
  );
};