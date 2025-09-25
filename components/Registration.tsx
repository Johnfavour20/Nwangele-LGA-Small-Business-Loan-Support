import React, { useState } from 'react';
import { NigeriaFlag, ImoStateSeal, LGA_WARDS } from '../constants';
import { Button } from './ui/Button';

interface RegistrationProps {
  onSwitchToLogin: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        ward: LGA_WARDS[0],
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        // In a real app, this would call an API to register the user.
        // We'll simulate a successful registration.
        console.log('Registering user:', formData);
        alert('Registration successful! You can now log in with the mock applicant account.');
        onSwitchToLogin();
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 bg-green-800 text-white p-12 hidden md:flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(4, 120, 87, 0.8), rgba(5, 150, 105, 0.9)), url(https://picsum.photos/seed/farm/800/1200)', backgroundSize: 'cover' }}>
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <ImoStateSeal />
                            <NigeriaFlag />
                        </div>
                        <h1 className="text-4xl font-bold leading-tight">Join the Nwangele LGA Economic Empowerment Program</h1>
                    </div>
                    <p className="text-lg opacity-90">Create your account to apply for small business support and contribute to local growth.</p>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create an Account</h2>
                    <p className="text-slate-600 mb-6">Get started with your application today.</p>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Adaobi Ekwueme" required />
                        </div>
                         <div>
                            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">Ward</label>
                             <select name="ward" value={formData.ward} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                                {LGA_WARDS.map(ward => <option key={ward} value={ward}>{ward}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" required />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" required />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <Button type="submit" className="w-full py-3 mt-2">Create Account</Button>
                    </form>
                    
                    <p className="text-center text-sm text-slate-600 mt-8">
                        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="font-semibold text-green-700 hover:underline">Login Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};