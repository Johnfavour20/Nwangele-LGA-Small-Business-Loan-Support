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
import type { User, Applicant, Message, Notification } from './types';
import { UserRole, LoanStatus, BusinessSector } from './types';
import { Toast } from './components/ui/Toast';

// Mock Data
const USERS_DATA: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@nwangele.gov.ng', role: UserRole.Admin, ward: 'Amuzi' },
    { id: 'user-2', name: 'Loan Officer', email: 'officer@officer.nwangele.gov.ng', role: UserRole.Officer, ward: 'Abajah' },
    { id: 'user-3', name: 'Adaobi Ekwueme', email: 'user@email.com', role: UserRole.Applicant, ward: 'Isu', nin: '12345678901', isBvnVerified: false },
    { id: 'user-4', name: 'Buchi Chukwu', email: 'buchi@email.com', role: UserRole.Applicant, ward: 'Umuozu', isBvnVerified: true, profilePictureUrl: 'https://i.pravatar.cc/150?u=buchi@email.com' },
    { id: 'user-5', name: 'Chinedu Eze', email: 'chinedu@email.com', role: UserRole.Applicant, ward: 'Dim-Na-Nume' },
];

const APPLICANTS_DATA: Applicant[] = [
    { id: 'APP-001', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Farms', sector: BusinessSector.Agriculture, loanAmount: 750000, loanPurpose: 'Purchase of fertilizers and seeds for the next planting season.', businessDescription: 'A small-scale farm focused on organic cassava and yam cultivation.', applicationDate: '2024-07-15', status: LoanStatus.Pending, documents: [{name: 'Business Plan.pdf', url: '#'}, {name: 'ID_Card.png', url: '#'}], bankName: 'Zenith Bank', accountNumber: '1234567890', accountName: 'Adaobi Ekwueme',
      messages: [
        { id: 'msg-1', senderId: 'user-2', senderName: 'Loan Officer', content: 'Good day, please can you provide a more detailed breakdown of how the funds will be used?', timestamp: '2024-07-16 10:30 AM'},
        { id: 'msg-2', senderId: 'user-3', senderName: 'Adaobi Ekwueme', content: 'Thank you for your message. ₦350,000 will be for high-yield seeds, ₦250,000 for organic fertilizers, and ₦150,000 for hiring temporary labor during planting.', timestamp: '2024-07-16 11:15 AM'},
      ]
    },
    { id: 'APP-002', userId: 'user-4', name: 'Buchi Chukwu', businessName: 'Buchi Tech Solutions', sector: BusinessSector.Technology, loanAmount: 1500000, loanPurpose: 'To buy new laptops and software for our development team.', businessDescription: 'A startup providing web development services to local businesses.', applicationDate: '2024-07-12', status: LoanStatus.Approved, documents: [{name: 'Proposal.pdf', url: '#'}], bankName: 'GTBank', accountNumber: '0987654321', accountName: 'Buchi Tech Solutions' },
    { id: 'APP-003', userId: 'user-3', name: 'Adaobi Ekwueme', businessName: 'Adaobi Weaves', sector: BusinessSector.Manufacturing, loanAmount: 400000, loanPurpose: 'To buy a new weaving machine.', businessDescription: 'Handmade traditional fabrics.', applicationDate: '2023-01-20', status: LoanStatus.Repaid, documents: [], bankName: 'First Bank', accountNumber: '1122334455', accountName: 'Adaobi Ekwueme' },
    { id: 'APP-004', userId: 'user-5', name: 'Chinedu Eze', businessName: 'Eze\'s Eatery', sector: BusinessSector.Services, loanAmount: 250000, loanPurpose: 'To renovate the kitchen area.', businessDescription: 'A local restaurant serving traditional Nigerian dishes.', applicationDate: '2024-06-30', status: LoanStatus.Disbursed, documents: [{name: 'Quotation.pdf', url: '#'}] },
    { id: 'APP-005', userId: 'user-5', name: 'Eze\'s Dry Cleaning', businessName: 'Eze\'s Dry Cleaning', sector: BusinessSector.Services, loanAmount: 600000, loanPurpose: 'For new washing machines.', businessDescription: 'A new dry cleaning business.', applicationDate: '2024-05-18', status: LoanStatus.Rejected, documents: [] },
];

const NOTIFICATIONS_DATA: Notification[] = [
    {
        id: 'notif-1',
        userId: 'user-3',
        title: 'Application Status Updated',
        message: 'Your application for "Adaobi Weaves" has been updated to Repaid.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        isRead: false,
        link: { view: 'profile', applicantId: 'APP-003' },
        type: 'status_update'
    },
    {
        id: 'notif-2',
        userId: 'user-1',
        title: 'New Message on APP-001',
        message: 'Adaobi Ekwueme sent a message regarding "Adaobi Farms".',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        isRead: false,
        link: { view: 'profile', applicantId: 'APP-001' },
        type: 'message'
    },
    {
        id: 'notif-3',
        userId: 'user-1',
        title: 'New Application Submitted',
        message: 'Buchi Chukwu submitted an application for "Buchi Tech Solutions".',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: true,
        link: { view: 'profile', applicantId: 'APP-002' },
        type: 'new_application'
    }
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
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
    const handleResize = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        ...notificationData
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
        prev.map(n => (n.userId === currentUser?.id ? { ...n, isRead: true } : n))
    );
  };
  
  const handleNavigateToNotificationLink = (link: Notification['link']) => {
    if (link?.view === 'profile') {
        const applicantToView = applicants.find(a => a.id === link.applicantId);
        if (applicantToView) {
            handleViewProfile(applicantToView);
        }
    }
  };


  const handleNavigate = (view: View) => {
    if (view === 'profile' && selectedApplicant) {
      setCurrentView('profile');
    } else {
      setSelectedApplicant(null);
      setCurrentView(view);
    }
     if (window.innerWidth < 1024) {
      setSidebarOpen(false);
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
    const applicant = applicants.find(app => app.id === applicantId);
    if (applicant) {
        addNotification({
            userId: applicant.userId,
            title: 'Application Status Updated',
            message: `Your application for "${applicant.businessName}" is now ${newStatus}.`,
            link: { view: 'profile', applicantId: applicant.id },
            type: 'status_update'
        });
    }

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
    setToast({ message: 'Application submitted successfully!', type: 'success' });
    setCurrentView('applications');
    
    // Notify admins and officers
    const adminsAndOfficers = users.filter(u => u.role === UserRole.Admin || u.role === UserRole.Officer);
    adminsAndOfficers.forEach(user => {
        addNotification({
            userId: user.id,
            title: 'New Application Submitted',
            message: `${currentUser?.name || 'A new applicant'} has submitted an application.`,
            type: 'new_application'
        });
    });
  };

  const handleSendMessage = (applicantId: string, content: string) => {
    if (!currentUser) return;

    const applicant = applicants.find(app => app.id === applicantId);
    if (!applicant) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    };
    
    // If current user is the applicant, notify admins/officers
    if (currentUser.id === applicant.userId) {
        const adminsAndOfficers = users.filter(u => u.role === UserRole.Admin || u.role === UserRole.Officer);
        adminsAndOfficers.forEach(user => {
            addNotification({
                userId: user.id,
                title: `New Message on ${applicant.id}`,
                message: `${applicant.name} sent a message regarding "${applicant.businessName}".`,
                link: { view: 'profile', applicantId: applicant.id },
                type: 'message'
            });
        });
    } else { // If current user is an admin/officer, notify the applicant
        addNotification({
            userId: applicant.userId,
            title: 'New Message from Loan Officer',
            message: `You have a new message regarding your application for "${applicant.businessName}".`,
            link: { view: 'profile', applicantId: applicant.id },
            type: 'message'
        });
    }


    const updateApplicantState = (prev: Applicant | null): Applicant | null => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), newMessage],
      };
    };

    setApplicants(prevApps => prevApps.map(app => 
        app.id === applicantId ? updateApplicantState(app) as Applicant : app
    ));

    if (selectedApplicant?.id === applicantId) {
      setSelectedApplicant(updateApplicantState);
    }
  };

  const handleBvnVerify = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, isBvnVerified: true } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, isBvnVerified: true } : null));
    }
    setToast({ message: 'BVN verified successfully!', type: 'success' });
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
      case 'dashboard': return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} users={users} />;
      case 'applications': return <Applications applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} />;
      case 'users': return <Users users={users} />;
      case 'profile': return selectedApplicant && <ApplicantProfile applicant={selectedApplicant} onBack={handleBackToList} onUpdateStatus={handleUpdateStatus} onUpdateApplicantDetails={handleUpdateApplicantDetails} onSendMessage={handleSendMessage} />;
      case 'new-application': return <NewApplicationForm onSubmit={handleNewApplicationSubmit} onCancel={() => setCurrentView('applications')} />;
      case 'reports': return <Reports applicants={applicants} users={users} />;
      case 'settings': return <Settings user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'my-profile': return <UserProfile user={currentUser} onUpdateUser={handleUpdateUser} onBvnVerify={handleBvnVerify} setToast={setToast} />;
      default: return <Dashboard applicants={applicants} onViewProfile={handleViewProfile} onStartNewApplication={() => setCurrentView('new-application')} searchTerm={searchTerm} users={users} />;
    }
  };

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-slate-50 text-slate-800">
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
            onNavigate={handleNavigate}
            notifications={userNotifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onNavigateToNotificationLink={handleNavigateToNotificationLink}
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