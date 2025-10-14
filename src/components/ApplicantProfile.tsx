import React, { useState, useEffect } from 'react';
import type { Applicant, GeminiAnalysis } from '../types';
import { LoanStatus, UserRole } from '../types';
import { useAuth } from '../App';
import { analyzeApplication } from '../services/geminiService';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Messaging } from './Messaging';
import { ConfirmationDialog } from './ui/ConfirmationDialog';
import { Spinner } from './ui/Spinner';
import { CollapsibleSection } from './ui/CollapsibleSection';

interface ApplicantProfileProps {
  applicant: Applicant;
  onBack: () => void;
  onUpdateStatus: (applicantId: string, newStatus: LoanStatus) => void;
  onUpdateApplicantDetails: (applicantId: string, details: Partial<Applicant>) => void;
  onSendMessage: (applicantId: string, content: string) => void;
}

const ProfileDetail: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
  <div className={className}>
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <p className="font-semibold text-slate-800 dark:text-slate-100">{value}</p>
  </div>
);

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
            isActive
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
    >
        {label}
    </button>
);

const BankDetailsForm: React.FC<{ applicant: Applicant; onUpdate: (details: Partial<Applicant>) => void }> = ({ applicant, onUpdate }) => {
    const [bankName, setBankName] = useState(applicant.bankName || '');
    const [accountName, setAccountName] = useState(applicant.accountName || '');
    const [accountNumber, setAccountNumber] = useState(applicant.accountNumber || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!/^\d{10}$/.test(accountNumber)) {
            setError('Account number must be exactly 10 digits.');
            return;
        }
        onUpdate({ bankName, accountName, accountNumber });
    };

    const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                    <input type="text" id="bankName" value={bankName} onChange={e => setBankName(e.target.value)} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Name</label>
                    <input type="text" id="accountName" value={accountName} onChange={e => setAccountName(e.target.value)} className={inputClasses} required />
                </div>
            </div>
            <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                <input type="text" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className={inputClasses} placeholder="10-digit number" required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="text-right">
                <Button type="submit">Save Bank Details</Button>
            </div>
        </form>
    );
};

const ChecklistItem: React.FC<{ text: string; isChecked: boolean; }> = ({ text, isChecked }) => (
    <li className={`flex items-center text-sm ${isChecked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
        <span className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${isChecked ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
            {isChecked && <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </span>
        {text}
    </li>
);

export const ApplicantProfile: React.FC<ApplicantProfileProps> = ({ applicant, onBack, onUpdateStatus, onUpdateApplicantDetails, onSendMessage }) => {
    const { currentUser } = useAuth();
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState<{ type: 'approve' | 'reject' } | null>(null);
    
    const isActionable = currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.Officer;

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!isActionable) {
                setIsLoadingAnalysis(false);
                return;
            }
            try {
                setIsLoadingAnalysis(true);
                setError(null);
                const result = await analyzeApplication(applicant);
                setAnalysis(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load AI analysis.');
            } finally {
                setIsLoadingAnalysis(false);
            }
        };

        fetchAnalysis();
    }, [applicant, isActionable]);

    const handleConfirmAction = () => {
        if (actionToConfirm?.type === 'approve') {
            onUpdateStatus(applicant.id, LoanStatus.Approved);
        } else if (actionToConfirm?.type === 'reject') {
            onUpdateStatus(applicant.id, LoanStatus.Rejected);
        }
        setActionToConfirm(null);
    };
    
    const handleLocalSendMessage = (content: string) => {
        onSendMessage(applicant.id, content);
    }

    const maskedAccountNumber = applicant.accountNumber ? `******${applicant.accountNumber.slice(-4)}` : 'N/A';
    
    return (
        <div className="space-y-6 animate-fade-in">
            <Button onClick={onBack} variant="outline">← Back to List</Button>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{applicant.name}</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">{applicant.businessName}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <Badge status={applicant.status} />
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700">
                <TabButton label="Application Details" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />
                <TabButton label="Verification & Payout" isActive={activeTab === 'payout'} onClick={() => setActiveTab('payout')} />
                <TabButton label="Communication" isActive={activeTab === 'communication'} onClick={() => setActiveTab('communication')} />
            </div>

            {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <CollapsibleSection title="Applicant & Business Information">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ProfileDetail label="Applicant Name" value={applicant.name} />
                                <ProfileDetail label="Business Name" value={applicant.businessName} />
                                <ProfileDetail label="Business Sector" value={applicant.sector} />
                                <ProfileDetail label="Application Date" value={applicant.applicationDate} />
                            </div>
                        </CollapsibleSection>
                         <CollapsibleSection title="Loan Details">
                            <div className="space-y-4">
                                <ProfileDetail label="Loan Amount" value={`₦${applicant.loanAmount.toLocaleString()}`} />
                                <ProfileDetail label="Purpose of Loan" value={applicant.loanPurpose} />
                                <ProfileDetail label="Business Description" value={<p className="whitespace-pre-wrap">{applicant.businessDescription}</p>} />
                            </div>
                        </CollapsibleSection>
                        <CollapsibleSection title="Uploaded Documents">
                            {applicant.documents.length > 0 ? (
                                <ul className="space-y-2">
                                    {applicant.documents.map(doc => (
                                        <li key={doc.name} className="flex items-center text-green-700 dark:text-green-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{doc.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400">No documents were uploaded.</p>
                            )}
                        </CollapsibleSection>
                    </div>

                    {isActionable && (
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                AI-Powered Analysis
                            </h3>
                            {isLoadingAnalysis && <div className="text-center p-8 flex justify-center items-center"><Spinner /></div>}
                            {error && <div className="text-center p-8 text-red-500"><p>{error}</p></div>}
                            {!isLoadingAnalysis && !error && analysis && (
                                <div className="space-y-4 text-sm">
                                    <div><p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Risk Assessment: <span className={`font-bold ${analysis.riskLevel === 'Low' ? 'text-green-500' : analysis.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{analysis.riskLevel}</span></p></div>
                                    <div><p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Summary:</p><p className="text-slate-500 dark:text-slate-400">{analysis.summary}</p></div>
                                    <div>
                                        <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Strengths:</p>
                                        <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-400">
                                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Risks / Concerns:</p>
                                        <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400">
                                            {analysis.risks.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            <div className="mt-6 pt-6 border-t dark:border-slate-700 flex gap-4">
                                <Button onClick={() => { setActionToConfirm({type: 'approve'}); setConfirmOpen(true); }} disabled={applicant.status !== LoanStatus.Pending}>Approve</Button>
                                <Button onClick={() => { setActionToConfirm({type: 'reject'}); setConfirmOpen(true); }} variant="outline" className="!border-red-500 !text-red-500 hover:!bg-red-50 dark:!border-red-500 dark:!text-red-500 dark:hover:!bg-red-500/10" disabled={applicant.status !== LoanStatus.Pending}>Reject</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'payout' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                         <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Bank Account Details</h3>
                         {currentUser?.role === UserRole.Applicant ? (
                             <>
                                {applicant.accountNumber ? (
                                    <div className="space-y-4">
                                        <ProfileDetail label="Bank Name" value={applicant.bankName} />
                                        <ProfileDetail label="Account Name" value={applicant.accountName} />
                                        <ProfileDetail label="Account Number" value={maskedAccountNumber} />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-slate-700">For security, your full account number is hidden. Contact support if you need to change these details.</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Please provide your bank account details for loan disbursement.</p>
                                        <BankDetailsForm applicant={applicant} onUpdate={(details) => onUpdateApplicantDetails(applicant.id, details)} />
                                    </>
                                )}
                             </>
                         ) : (
                             <>
                                {applicant.accountNumber ? (
                                     <div className="space-y-4">
                                        <ProfileDetail label="Bank Name" value={applicant.bankName} />
                                        <ProfileDetail label="Account Name" value={applicant.accountName} />
                                        <ProfileDetail label="Account Number" value={applicant.accountNumber} />
                                    </div>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400">Applicant has not provided their bank details yet.</p>
                                )}
                             </>
                         )}
                    </div>
                     {isActionable && (
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Verification Checklist</h3>
                            <ul className="space-y-3">
                               <ChecklistItem text="Identity Verified (NIN)" isChecked={!!currentUser?.nin} />
                               <ChecklistItem text="Documents Reviewed" isChecked={applicant.documents.length > 0} />
                               <ChecklistItem text="Bank Account Details Provided" isChecked={!!applicant.accountNumber} />
                            </ul>
                        </div>
                    )}
                </div>
            )}
            
             {activeTab === 'communication' && currentUser && (
                 <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <Messaging 
                        messages={applicant.messages || []}
                        currentUser={currentUser}
                        onSendMessage={handleLocalSendMessage}
                    />
                </div>
            )}

            <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                title={`Confirm Application ${actionToConfirm?.type === 'approve' ? 'Approval' : 'Rejection'}`}
                message={`Are you sure you want to ${actionToConfirm?.type} this application? This action cannot be undone.`}
            />
        </div>
    );
};