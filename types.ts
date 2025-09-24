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
}

export interface GeminiAnalysis {
  summary: string;
  strengths: string[];
  risks: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}