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
import type { User, Applicant, Notification } from './types';
import { UserRole, LoanStatus, BusinessSector } from './types';
import { Toast } from './components/ui/Toast';

// Mock Data
const USERS_DATA: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@nwangele.gov.ng', role: UserRole.Admin, ward: 'Amuzi' },
    { id: 'user-2', name: 'Loan Officer', email: 'officer@officer.nwangele.gov.ng', role: UserRole.Officer, ward: 'Abajah' },
    { id: 'user-3', name: 'Adaobi Ekwueme', email: 'user@email.com', role: UserRole.Applicant, ward: 'Isu', nin: '12345678901', profilePictureUrl: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 'user-4', name: 'Buchi Chukwu', email: 'buchi@email.com', role: UserRole.Applicant, ward: 'Umuozu' },
    { id: 'user-5', name: 'Chinedu Eze', email: 'chinedu@email.com', role: UserRole.Applicant, ward: 'Dim-Na-Nume' },
];

const APPLICANTS_DATA: Applicant[] = [
    { id: 'APP-001', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Farms', sector: BusinessSector.Agriculture, loanAmount: 750000, loanPurpose: 'Purchase of fertilizers and seeds for the next planting season.', businessDescription: 'A small-scale farm focused on organic cassava and yam cultivation.', applicationDate: '2024-07-15', status: LoanStatus.Pending, documents: [{name: 'Business Plan.pdf', url: '#'}, {name: 'ID_Card.png', url: '#'}], bankName: 'Zenith Bank', accountNumber: '1234567890', accountName: 'Adaobi Ekwueme', messages: [
        { id: 'msg-1', senderId: 'user-2', senderName: 'Loan Officer', content: 'Your application looks promising. Can you provide a more detailed breakdown of your expected costs?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 'msg-2', senderId: 'user-3', senderName: 'Adaobi Ekwueme', content: 'Of course! I will upload a revised document shortly with the cost breakdown.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ]},
    { id: 'APP-002', userId: 'user-4', name: 'Buchi Chukwu', businessName: 'Buchi Tech Solutions', sector: BusinessSector.Technology, loanAmount: 1500000, loanPurpose: 'To buy new laptops and software for our development team.', businessDescription: 'A startup providing web development services to local businesses.', applicationDate: '2024-07-12', status: LoanStatus.Approved, documents: [{name: 'Proposal.pdf', url: '#'}], bankName: 'GTBank', accountNumber: '0987654321', accountName: 'Buchi Tech Solutions', messages: [] },
    { id: 'APP-003', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Weaves', sector: BusinessSector.Manufacturing, loanAmount: 400000, loanPurpose: 'To buy a new weaving machine.', businessDescription: 'Handmade traditional fabrics.', applicationDate: '2023-01-20', status: LoanStatus.Repaid, documents: [], bankName: 'First Bank', accountNumber: '1122334455', accountName: 'Adaobi Ekwueme', messages: [] },
    { id: 'APP-004', userId: 'user-5', name: 'Chinedu Eze', businessName: 'Eze\'s Eatery', sector: BusinessSector.Services, loanAmount: 250000, loanPurpose: 'To renovate the kitchen area.', businessDescription: 'A local restaurant serving traditional Nigerian dishes.', applicationDate: '2024-06-30', status: LoanStatus.Disbursed, documents: [{name: 'Quotation.pdf', url: '#'}], messages: [] },
    { id: 'APP-005', userId: 'user-5', name: 'Eze\'s Dry Cleaning', businessName: 'Eze\'s Dry Cleaning', sector: BusinessSector.Services, loanAmount: 600000, loanPurpose: 'For new washing machines.', businessDescription: 'A new dry cleaning business.', applicationDate: '2024-05-18', status: LoanStatus.Rejected, documents: [], messages: [] },
];

const NOTIFICATIONS_DATA: Notification[] = [
    { id: 'notif-1', userId: 'user-3', title: 'Status Update', message: 'Your application for Buchi Tech Solutions has been Approved.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: true, link: { view: 'profile', applicantId: 'APP-002' }, type: 'status_update' },
    { id: 'notif-2', userId: 'user-2', title: 'New Application', message: 'Adaobi Ekwueme submitted a new application for Adaobi Farms.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isRead: false, link: { view: 'profile', applicantId: 'APP-001' }, type: 'new_application' },
    { id: 'notif-3', userId: 'user-3', title: 'New Message', message: 'You have a new message from a Loan Officer regarding Adaobi Farms.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false, link: { view: 'profile', applicantId: 'APP-001' }, type: 'message' },
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
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
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

  const handleNavigate = (view: View, applicantId?: string) => {
    if (view === 'profile') {
        const applicantToView = applicants.find(a => a.id === applicantId);
        if (applicantToView) {
            setSelectedApplicant(applicantToView);
            setCurrentView('profile');
        }
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
    let updatedApplicant: Applicant | undefined;
    setApplicants(prev => 
      prev.map(app => {
        if (app.id === applicantId) {
            updatedApplicant = { ...app, status: newStatus };
            return updatedApplicant;
        }
        return app;
      })
    );

    if (updatedApplicant) {
        setNotifications(prev => [...prev, {
            id: `notif-${Date.now()}`,
            userId: updatedApplicant!.userId,
            title: 'Application Status Updated',
            message: `Your application for ${updatedApplicant!.businessName} has been updated to ${newStatus}.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            link: { view: 'profile', applicantId },
            type: 'status_update',
        }]);
    }
    
    setToast({ message: `Application status updated to ${newStatus}`, type: 'success' });
    handleBackToList();
  };
  
  const handleUpdateApplicantDetails = (applicantId: string, details: Partial<Applicant>) => {
    setApplicants(prev => prev.map(app => app.id === applicantId ? { ...app, ...details } : app));
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
  
  const handleSendMessage = (applicantId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: new Date().toISOString()
    };
    
    let targetApplicant: Applicant | undefined;
    setApplicants(prev => prev.map(app => {
        if (app.id === applicantId) {
            const updatedApp = { ...app, messages: [...(app.messages || []), newMessage] };
            targetApplicant = updatedApp;
            return updatedApp;
        }
        return app;
    }));
    
    if (targetApplicant) {
        // Notify the other party
        const recipientId = currentUser.role === UserRole.Applicant 
            ? users.find(u => u.role === UserRole.Officer)?.id // Simplified: notify first officer
            : targetApplicant.userId;
        
        if (recipientId) {
            setNotifications(prev => [...prev, {
                id: `notif-${Date.now()}`,
                userId: recipientId,
                title: `New Message from ${currentUser.name}`,
                message: `Regarding application for ${targetApplicant!.businessName}.`,
                timestamp: new Date().toISOString(),
                isRead: false,
                link: { view: 'profile', applicantId },
                type: 'message'
            }]);
        }
    }
    
    if (selectedApplicant?.id === applicantId) {
        setSelectedApplicant(prev => prev ? { ...prev, messages: [...(prev.messages || []), newMessage] } : null);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true })));
  };

  const handleNewApplicationSubmit = () => {
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
  
  const userNotifications = notifications.filter(n => n.userId === currentUser.id || (currentUser.role === UserRole.Admin && n.type === 'new_application')).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
      case 'applications': return <Applications applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
      case 'users': return <Users users={users} />;
      case 'profile': return selectedApplicant && <ApplicantProfile applicant={selectedApplicant} onBack={handleBackToList} onUpdateStatus={handleUpdateStatus} onUpdateApplicantDetails={handleUpdateApplicantDetails} onSendMessage={handleSendMessage} />;
      case 'new-application': return <NewApplicationForm onSubmit={handleNewApplicationSubmit} onCancel={() => setCurrentView('applications')} />;
      case 'reports': return <Reports applicants={applicants} users={users} />;
      case 'settings': return <Settings user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'my-profile': return <UserProfile user={currentUser} onUpdateUser={handleUpdateUser} />;
      default: return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
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
            notifications={userNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNavigate={handleNavigate}
          />
          <main className="p-4 sm:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
            {renderContent()}
          </main>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AuthContext.Provider>
  );
};

export default App;