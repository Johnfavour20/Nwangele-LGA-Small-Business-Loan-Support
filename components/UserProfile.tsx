import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
  };

  const profileCompletion = formData.nin ? 85 : 50;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h2>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <h4 className="text-gray-500 dark:text-gray-400 font-medium">Profile Completion</h4>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-3">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">{profileCompletion}% Complete</p>
            {profileCompletion < 100 && <p className="text-xs text-gray-500 mt-1">Provide your NIN to improve your profile completeness.</p>}
        </div>

        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="nin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">National Identification Number (NIN)</label>
                        <input type="text" name="nin" id="nin" value={formData.nin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter your 11-digit NIN"/>
                    </div>
                    <div>
                        <label htmlFor="ward" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward</label>
                        <input type="text" name="ward" id="ward" value={user.ward} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-400 rounded-lg" disabled readOnly />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl text-right">
                <Button type="submit">Save Profile</Button>
            </div>
        </form>

         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Change Password</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl text-right">
                <Button variant="outline">Update Password</Button>
            </div>
        </div>
    </div>
  );
};