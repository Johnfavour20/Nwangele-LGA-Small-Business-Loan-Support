export enum UserRole {
  Admin = 'Admin',
  Officer = 'Loan Officer',
  Applicant = 'Applicant',
}

export enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Disbursed = 'Disbursed',
  Repaid = 'Repaid',
}

export enum BusinessSector {
  Retail = 'Retail',
  Technology = 'Technology',
  Agriculture = 'Agriculture',
  Manufacturing = 'Manufacturing',
  Services = 'Services',
  Healthcare = 'Healthcare',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward?: string;
  nin?: string;
  // FIX: Added optional fields for profile picture and BVN verification status.
  profilePictureUrl?: string;
  isBvnVerified?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string; // ISO string
}

export interface Applicant {
  id: string;
  userId: string;
  name: string;
  businessName: string;
  sector: BusinessSector;
  loanAmount: number;
  loanPurpose: string;
  businessDescription: string;
  applicationDate: string;
  status: LoanStatus;
  documents: { name: string; url: string }[];
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  messages?: Message[];
}

export interface GeminiAnalysis {
  summary: string;
  strengths: string[];
  risks: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

// FIX: Added missing GroundedAnalysis type for geminiService.
export interface GroundedAnalysis {
  text: string;
  sources: {
    uri: string;
    title: string;
  }[];
}

// FIX: Added missing Notification type for UI components.
export interface Notification {
  id: string;
  type: 'new_application' | 'status_update' | 'message';
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  link?: {
    view: 'profile';
    applicantId: string;
  };
}
