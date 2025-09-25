# Nwangele LGA Small Business Loan Support System

**Programmer:** Igboeche Johnfavour Ikenna  
**Contact:** igboechejohn@gmail.com | 08169849839

---

## 1. Project Overview

A comprehensive, AI-enhanced database management system designed to streamline the small business loan support program in Nwangele Local Government Area, Imo State, Nigeria. This is a pure frontend application that provides a role-based portal for Applicants, Loan Officers, and Administrators, featuring an AI-powered risk assessment tool to aid in decision-making.

The entire application is built with a **mobile-first, fully responsive design**, ensuring a seamless and accessible experience across all devices, from desktops to smartphones. It uses mock data and runs entirely in the browser, with no backend required.

![Login Screen](https://picsum.photos/seed/loginpage/1200/600)
*The modern and secure login portal.*

## 2. Core Features

### For All Users
- **Secure Authentication:** Role-based login for Applicants, Loan Officers, and Admins (using in-browser mock data).
- **Fully Responsive Design:** Flawless user experience on desktop, tablet, and mobile devices.
- **Dark/Light Mode:** Theme toggling for user comfort.

### For Applicants
- **Personalized Dashboard:** A clear summary of application statuses, active loans, and profile completion.
- **Multi-Step Application Form:** An intuitive, user-friendly stepper guides applicants through the submission process, including document uploads.
- **Application Tracking:** View the status of all submitted applications in a clean, organized table.
- **Profile Management:** Applicants can update their personal information, such as their National Identification Number (NIN).
- **Secure Bank Details Form:** Provide payout information securely, with validation and masking for privacy.

### For Admins & Loan Officers
- **Advanced Analytics Dashboard:** An aggregated view of all loan applications, featuring interactive charts for loan statuses, applications by business sector, and monthly trends.
- **Comprehensive Application Review:** Easily browse, filter, and view detailed profiles for each applicant.
- **AI-Powered Risk Assessment:** Generate an AI analysis of an application with a single click, providing a summary, potential strengths, risks, and an overall risk level to support informed decision-making.
- **Verification & Payout Management:** A dedicated tab to review applicant documents, verify details, and manage the disbursement process.
- **User Management (Admin Only):** Admins can add, edit, and manage user accounts and roles within the system.

## 3. Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript & Vite
- **Styling:** Tailwind CSS for a utility-first, responsive, and modern design system.
- **State Management:** React Context API for authentication, theme, and global state.
- **Data Visualization:** Recharts for interactive and beautiful charts.
- **AI Integration:** The frontend is connected to the Google Gemini API for risk assessment.

## 4. Getting Started

To run this application locally, follow these steps.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Navigate to the project's root directory (where `package.json` is located) and run:
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Once installation is complete, start the Vite development server:
    ```bash
    npm run dev
    ```
The application will be available at a local URL, typically `http://localhost:5173`. The Google Gemini API key is expected to be provided via environment variables in the execution environment.

## 5. Deployment on Vercel

This Vite project is configured for easy deployment on Vercel.

1.  **Push to a Git Provider:** Make sure your code is on GitHub, GitLab, or Bitbucket.
2.  **Import Project in Vercel:**
    - Log in to your Vercel account and click "Add New... > Project".
    - Select your Git repository.
3.  **Configure Project:**
    - Vercel should automatically detect that you are using **Vite** and configure the build settings correctly.
    - **Framework Preset:** `Vite`
    - **Build Command:** `vite build` (or `npm run build`)
    - **Output Directory:** `dist`
4.  **Add Environment Variable:**
    - In the Vercel project settings, go to "Environment Variables".
    - Add the environment variable for your Google Gemini API key as required by the hosting platform.
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your application.

## 6. Authentication & Demo Credentials
The application features a role-based access control system using mock data. For demonstration purposes, you can log in using the following credentials on the login screen:

| Role      | Email                              | Password     |
|-----------|------------------------------------|--------------|
| **Admin**     | `admin@nwangele.gov.ng`            | `admin123`   |
| **Officer** | `officer@officer.nwangele.gov.ng`  | `officer123` |
| **Applicant** | `user@email.com`                   | `user123`    |

## 7. Project Programmer

- **Name:** Igboeche Johnfavour Ikenna
- **Email:** [igboechejohn@gmail.com](mailto:igboechejohn@gmail.com)
- **Phone:** 08169849839
