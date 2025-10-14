import React, { useState } from 'react';
import { useAuth } from '../App';
import { NigeriaFlag, ImoStateSeal } from '../constants';
import { Button } from './ui/Button';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    
    // Demo credentials for easy display
    const demoCreds = [
        { role: 'Admin', user: 'admin@nwangele.gov.ng', pass: 'admin123' },
        { role: 'Officer', user: 'officer@officer.nwangele.gov.ng', pass: 'officer123' },
        { role: 'Applicant', user: 'user@email.com', pass: 'user123' },
    ];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(email, password)) {
            setError('Invalid email or password. Please try again.');
        }
    };
    
    const handleDemoClick = (user: string, pass: string) => {
        setError('');
        login(user, pass);
    }

    const inputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-slate-200";

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 bg-green-800 text-white p-12 hidden md:flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(4, 120, 87, 0.8), rgba(5, 150, 105, 0.9)), url(https://picsum.photos/seed/nigeria/800/1200)', backgroundSize: 'cover' }}>
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <ImoStateSeal />
                            <NigeriaFlag />
                        </div>
                        <h1 className="text-4xl font-bold leading-tight">Nwangele LGA Small Business Loan Support</h1>
                    </div>
                    <p className="text-lg opacity-90">"Empowering our local entrepreneurs is the cornerstone of a prosperous future for Imo State."</p>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome Back</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Sign in to access the portal.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                placeholder="name@nwangele.gov.ng"
                                required
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClasses}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <Button type="submit" className="w-full py-3">Sign In</Button>
                    </form>
                    
                    <div className="mt-6">
                        <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Quick Access (Demo)</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                           {demoCreds.map(cred => (
                             <button key={cred.role} onClick={() => handleDemoClick(cred.user, cred.pass)} className="flex-1 text-center py-2 px-2 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition">
                                 Login as {cred.role}
                             </button>
                           ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} className="font-semibold text-green-700 hover:underline">Register Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};