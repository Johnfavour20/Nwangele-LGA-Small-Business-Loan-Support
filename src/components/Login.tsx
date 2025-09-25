import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { NigeriaFlag, ImoStateSeal } from '../constants';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const inspirationalContent = [
    {
        imageUrl: 'https://picsum.photos/seed/imo_market/800/1200',
        quote: "Empowering our local entrepreneurs is the cornerstone of a prosperous future for Imo State."
    },
    {
        imageUrl: 'https://picsum.photos/seed/imo_nature/800/1200',
        quote: "From our fertile lands to our bustling cities, opportunity blossoms in the Heartland."
    },
    {
        imageUrl: 'https://picsum.photos/seed/imo_community/800/1200',
        quote: "The strength of our community is the foundation upon which great businesses are built."
    },
    {
        imageUrl: 'https://picsum.photos/seed/imo_agriculture/800/1200',
        quote: "Investing in the soil of our home yields the greatest returns for generations to come."
    }
];

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % inspirationalContent.length);
        }, 7000); // Change image and quote every 7 seconds

        return () => clearInterval(intervalId);
    }, []);
    
    // Demo credentials for easy display
    const demoCreds = [
        { role: 'Admin', user: 'admin@nwangele.gov.ng', pass: 'admin123' },
        { role: 'Officer', user: 'officer@officer.nwangele.gov.ng', pass: 'officer123' },
        { role: 'Applicant', user: 'user@email.com', pass: 'user123' },
    ];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setTimeout(() => {
            if (!login(email, password)) {
                setError('Invalid email or password. Please try again.');
                setIsLoading(false);
            }
        }, 1000);
    };
    
    const handleDemoClick = (user: string, pass: string) => {
        setError('');
        setIsLoading(true);
        setTimeout(() => {
            login(user, pass);
        }, 500);
    }
    
    const { imageUrl, quote } = inspirationalContent[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
                {/* Left Panel */}
                <div 
                    className="w-1/2 bg-green-800 text-white p-12 hidden md:flex flex-col justify-between transition-all duration-1000" 
                    style={{ 
                        backgroundImage: `linear-gradient(to bottom, rgba(4, 120, 87, 0.8), rgba(5, 150, 105, 0.9)), url(${imageUrl})`, 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <ImoStateSeal />
                            <NigeriaFlag />
                        </div>
                        <h1 className="text-4xl font-bold leading-tight">Nwangele LGA Small Business Loan Support</h1>
                    </div>
                     <p key={currentIndex} className="text-lg opacity-90 animate-fade-in">"{quote}"</p>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600 mb-6">Sign in to access the portal.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                placeholder="name@nwangele.gov.ng"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-gray-700 block mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <Button type="submit" className="w-full py-3" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" /> : 'Sign In'}
                        </Button>
                    </form>
                    
                    <div className="mt-6">
                        <p className="text-center text-sm font-semibold text-gray-500 mb-3">Quick Access (Demo)</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                           {demoCreds.map(cred => (
                             <button key={cred.role} onClick={() => handleDemoClick(cred.user, cred.pass)} className="flex-1 text-center py-2 px-2 text-xs font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50" disabled={isLoading}>
                                 Login as {cred.role}
                             </button>
                           ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} className="font-semibold text-green-700 hover:underline">Register Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};