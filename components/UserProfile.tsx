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
        <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h4 className="text-slate-500 font-medium">Profile Completion</h4>
            <div className="w-full bg-slate-200 rounded-full h-2.5 my-3">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <p className="text-sm font-semibold text-green-600">{profileCompletion}% Complete</p>
            {profileCompletion < 100 && <p className="text-xs text-slate-500 mt-