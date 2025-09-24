# Nwangele LGA Small Business Loan Support System

**Programmer:** Igboeche Johnfavour Ikenna  
**Contact:** igboechejohn@gmail.com | 08169849839

---

## 1. Project Overview

A comprehensive, AI-enhanced database management system designed to streamline the small business loan support program in Nwangele Local Government Area, Imo State, Nigeria. This full-stack application provides a role-based portal for Applicants, Loan Officers, and Administrators, featuring an AI-powered risk assessment tool to aid in decision-making.

The entire application is built with a **mobile-first, fully responsive design**, ensuring a seamless and accessible experience across all devices, from desktops to smartphones.

![Login Screen](https://picsum.photos/seed/loginpage/1200/600)
*The modern and secure login portal.*

## 2. Core Features

### For All Users
- **Secure Authentication:** Role-based login for Applicants, Loan Officers, and Admins.
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

## 3. Responsive Design Showcase

The application adapts beautifully to different screen sizes.

| Desktop View | Tablet View | Mobile View |
| :---: | :---: | :---: |
| ![Desktop View](https://picsum.photos/seed/desktop/800/600) | ![Tablet View](https://picsum.photos/seed/tablet/800/600) | ![Mobile View](https://picsum.photos/seed/mobile/800/600) |


## 4. Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS for a utility-first, responsive, and modern design system.
- **State Management:** React Context API for authentication, theme, and global state.
- **Data Visualization:** Recharts for interactive and beautiful charts.
- **AI Integration (Mocked):** A simulated service (`geminiService.ts`) demonstrates the workflow for calling an AI model like Google Gemini.

### Backend (Conceptual)
The frontend is designed to work with a robust backend service.
- **Framework:** Python (Flask)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **AI Integration:** Google Gemini API via the `@google/genai` SDK.
- **Containerization:** Docker & Docker Compose for consistent development and deployment environments.

## 5. Getting Started (Frontend)

To run the frontend of this application locally, follow these steps.

### Prerequisites
- A modern web browser like Chrome, Firefox, or Safari.
- A simple local web server.

### Installation & Setup
1.  **Download the project files:**
    Unzip the project files into a folder on your computer.

2.  **No Installation Needed:**
    This project uses CDN-hosted dependencies via an `importmap` in `index.html`, so no `npm install` is required. All necessary libraries (React, Recharts, Tailwind CSS) are loaded directly in the browser.

3.  **Run the application:**
    Since there's no build step, you must serve the project directory with a static server to handle ES module imports correctly. Opening `index.html` directly from the filesystem will not work.
    
    **Option A: Using VS Code's Live Server Extension**
    - Install the "Live Server" extension from the VS Code Marketplace.
    - Right-click on the `index.html` file in the explorer and select "Open with Live Server".

    **Option B: Using `serve` (Requires Node.js)**
    - Open your terminal in the project's root directory.
    - Install `serve` globally if you don't have it:
      ```bash
      npm install -g serve
      ```
    - Run the server:
      ```bash
      serve
      ```
    The application will be available at a local URL like `http://localhost:3000`.

## 6. Authentication & Demo Credentials
The application features a role-based access control system. For demonstration purposes, you can log in using the following credentials on the login screen:

| Role      | Email                              | Password     |
|-----------|------------------------------------|--------------|
| **Admin**     | `admin@nwangele.gov.ng`            | `admin123`   |
| **Officer** | `officer@officer.nwangele.gov.ng`  | `officer123` |
| **Applicant** | `user@email.com`                   | `user123`    |

## 7. Project Programmer

- **Name:** Igboeche Johnfavour Ikenna
- **Email:** [igboechejohn@gmail.com](mailto:igboechejohn@gmail.com)
- **Phone:** 08169849839
