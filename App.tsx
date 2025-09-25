import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { Dashboard } from './components/Dashboard';
import { Applications } from './components/Applications';
import { Users } from './components/Users';
import { ApplicantProfile } from './components/ApplicantProfile';
import { NewApplicationForm } from './components/NewApplicationForm';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { UserProfile } from './components/UserProfile';
import type { User, Applicant } from './types';
import { UserRole, LoanStatus, BusinessSector } from './types';
import { Toast } from './components/ui/Toast';

// Mock Data
const USERS_DATA: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@nwangele.gov.ng', role: UserRole.Admin, ward: 'Amuzi' },
    { id: 'user-2', name: 'Loan Officer', email: 'officer@officer.nwangele.gov.ng', role: UserRole.Officer, ward: 'Abajah' },
    { id: 'user-3', name: 'Adaobi Ekwueme', email: 'user@email.com', role: UserRole.Applicant, ward: 'Isu', nin: '12345678901' },
    { id: 'user-4', name: 'Buchi Chukwu', email: 'buchi@email.com', role: UserRole.Applicant, ward: 'Umuozu' },
    { id: 'user-5', name: 'Chinedu Eze', email: 'chinedu@email.com', role: UserRole.Applicant, ward: 'Dim-Na-Nume' },
];

const APPLICANTS_DATA: Applicant[] = [
    { id: 'APP-001', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Farms', sector: BusinessSector.Agriculture, loanAmount: 750000, loanPurpose: 'Purchase of fertilizers and seeds for the next planting season.', businessDescription: 'A small-scale farm focused on organic cassava and yam cultivation.', applicationDate: '2024-07-15', status: LoanStatus.Pending, documents: [{name: 'Business Plan.pdf', url: '#'}, {name: 'ID_Card.png', url: '#'}], bankName: 'Zenith Bank', accountNumber: '1234567890', accountName: 'Adaobi Ekwueme' },
    { id: 'APP-002', userId: 'user-4', name: 'Buchi Chukwu', businessName: 'Buchi Tech Solutions', sector: BusinessSector.Technology, loanAmount: 1500000, loanPurpose: 'To buy new laptops and software for our development team.', businessDescription: 'A startup providing web development services to local businesses.', applicationDate: '2024-07-12', status: LoanStatus.Approved, documents: [{name: 'Proposal.pdf', url: '#'}], bankName: 'GTBank', accountNumber: '0987654321', accountName: 'Buchi Tech Solutions' },
    { id: 'APP-003', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Weaves', sector: BusinessSector.Manufacturing, loanAmount: 400000, loanPurpose: 'To buy a new weaving machine.', businessDescription: 'Handmade traditional fabrics.', applicationDate: '2023-01-20', status: LoanStatus.Repaid, documents: [], bankName: 'First Bank', accountNumber: '1122334455', accountName: 'Adaobi Ekwueme' },
    { id: 'APP-004', userId: 'user-5', name: 'Chinedu Eze', businessName: 'Eze\'s Eatery', sector: BusinessSector.Services, loanAmount: 250000, loanPurpose: 'To renovate the kitchen area.', businessDescription: 'A local restaurant serving traditional Nigerian dishes.', applicationDate: '2024-06-30', status: LoanStatus.Disbursed, documents: [{name: 'Quotation.pdf', url: '#'}] },
    { id: 'APP-005', userId: 'user-5', name: 'Eze\'s Dry Cleaning', businessName: 'Eze\'s Dry Cleaning', sector: BusinessSector.Services, loanAmount: 600000, loanPurpose: 'For new washing machines.', businessDescription: 'A new dry cleaning business.', applicationDate: '2024-05-18', status: LoanStatus.Rejected, documents: [] },
];


export type View = 'login' | 'register' | 'dashboard' | 'applications' | 'users' | 'reports' | 'settings' | 'profile' | 'new-application' | 'my-profile';
type ToastState = { message: string, type: 'success' | 'error' } | null;

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS_DATA);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    // In a real app, password would be hashed and checked on the backend
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const handleNavigate = (view: View) => {
    if (view === 'profile' && selectedApplicant) {
      setCurrentView('profile');
    } else {
      setSelectedApplicant(null);
      setCurrentView(view);
    }
  };
  
  const handleViewProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setCurrentView('profile');
  };
  
  const handleBackToList = () => {
      setSelectedApplicant(null);
      setCurrentView('applications');
  };

  const handleUpdateStatus = (applicantId: string, newStatus: LoanStatus) => {
    setApplicants(prev => 
      prev.map(app => 
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
    setToast({ message: `Application status updated to ${newStatus}`, type: 'success' });
    handleBackToList();
  };
  
  const handleUpdateApplicantDetails = (applicantId: string, details: Partial<Applicant>) => {
    const updatedApplicants = applicants.map(app => 
        app.id === applicantId ? { ...app, ...details } : app
    );
    setApplicants(updatedApplicants);

    if (selectedApplicant?.id === applicantId) {
        setSelectedApplicant(prev => prev ? { ...prev, ...details } : null);
    }
    setToast({ message: 'Bank details updated successfully!', type: 'success' });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  const handleNewApplicationSubmit = () => {
    // In a real app, this would submit to a backend and add a new application.
    // For now, just show a success message and go to applications view.
    setToast({ message: 'Application submitted successfully!', type: 'success' });
    setCurrentView('applications');
  };

  const authContextValue = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  if (!currentUser) {
    return (
      <AuthContext.Provider value={authContextValue}>
        {currentView === 'register' 
          ? <Registration onSwitchToLogin={() => setCurrentView('login')} />
          : <Login onSwitchToRegister={() => setCurrentView('register')} />
        }
      </AuthContext.Provider>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
      case 'applications': return <Applications applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
      case 'users': return <Users users={users} />;
      case 'profile': return selectedApplicant && <ApplicantProfile applicant={selectedApplicant} onBack={handleBackToList} onUpdateStatus={handleUpdateStatus} onUpdateApplicantDetails={handleUpdateApplicantDetails} />;
      case 'new-application': return <NewApplicationForm onSubmit={handleNewApplicationSubmit} onCancel={() => setCurrentView('applications')} />;
      case 'reports': return <Reports applicants={applicants} users={users} />;
      case 'settings': return <Settings user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'my-profile': return <UserProfile user={currentUser} onUpdateUser={handleUpdateUser} />;
      default: return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-slate-50 text-slate-900">
        {isSidebarOpen && (
            <div 
                onClick={() => setSidebarOpen(false)} 
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            ></div>
        )}
        <Sidebar currentView={currentView} onNavigate={handleNavigate} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <Header 
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            currentView={currentView}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <main className="p-4 sm:p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthContext.Provider>
  );
};

export default App;