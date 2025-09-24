import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const SettingsCard: React.FC<{ title: string, children: React.ReactNode, footer?: React.ReactNode }> = ({ title, children, footer }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-gray-700">
        <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <div className="mt-4 space-y-4">{children}</div>
        </div>
        {footer && (
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-b-xl text-right">
                {footer}
            </div>
        )}
    </div>
);

const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (e: boolean) => void; }> = ({ label, enabled, setEnabled }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <div className={`block w-10 h-6 rounded-full transition ${enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-full' : ''}`}></div>
        </div>
    </label>
);


export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });
    
    // Mock state for notification toggles
    const [notifications, setNotifications] = useState({
        newApplications: true,
        statusUpdates: false,
        weeklySummary: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdateUser({ ...user, ...formData });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
            
            <SettingsCard
                title="Profile Information"
                footer={<Button onClick={handleSave}>Save Changes</Button>}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title="Notification Preferences">
                <Toggle label="Email on new applications" enabled={notifications.newApplications} setEnabled={(e) => setNotifications({...notifications, newApplications: e})} />
                <Toggle label="Email on application status updates" enabled={notifications.statusUpdates} setEnabled={(e) => setNotifications({...notifications, statusUpdates: e})} />
                <Toggle label="Receive weekly summary report" enabled={notifications.weeklySummary} setEnabled={(e) => setNotifications({...notifications, weeklySummary: e})} />
            </SettingsCard>
            
            <SettingsCard 
                title="Security"
                footer={<Button variant="outline">Update Password</Button>}
            >
                <p className="text-sm text-gray-600 dark:text-gray-300">Change your account password.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};