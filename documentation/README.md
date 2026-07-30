# CivicAI - AI Powered Public Service Automation Platform

**CivicAI** is an end-to-end, production-ready municipal citizen service automation platform. It automates complaint intake, performs real-time Gemini AI NLP classification, routes tickets to department field officers, tracks SLA resolution progress, and provides analytics dashboards for governance transparency.

---

## Technical Stack & Architecture

- **Frontend**: React (Vite), Tailwind CSS (Glassmorphic design system), React Router v6, Axios, Framer Motion, Chart.js & react-chartjs-2, Lucide React icons.
- **Backend**: PHP 8 REST API (PDO MySQL, JWT authentication, file upload engine, Gemini API integration, security middleware).
- **Database**: MySQL schema (`database/civicai.sql`) with foreign key constraints, indexes, triggers, and full seed data.
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` endpoint) with automated NLP fallback rule classifier.

---

## Directory Structure

```
civic ai/
├── frontend/             # React Vite Application
│   ├── src/
│   │   ├── components/   # Common & Layout UI components
│   │   ├── context/      # AuthContext & ToastContext
│   │   ├── pages/        # Citizen, Officer, Admin & Auth Pages
│   │   ├── services/     # Axios API configuration
│   │   ├── App.jsx       # App routing table
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # PHP REST API Engine
│   ├── config/           # Database, JWT, CORS settings
│   ├── controllers/      # Auth, Complaint, Officer, Admin, Analytics, Notification
│   ├── helpers/          # Gemini AI engine & JSON responses
│   ├── middleware/       # JWT Auth & Role guards
│   ├── uploads/          # Complaint & resolution photo attachments
│   ├── index.php         # REST router dispatcher
│   └── .htaccess
├── database/             # MySQL Database
│   └── civicai.sql       # Complete DB schema & seed data script
└── documentation/        # System documentation
```

---

## XAMPP Quickstart & Deployment Guide

### 1. Database Setup
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open `http://localhost/phpmyadmin`.
3. Click on the **SQL** tab and execute the full contents of `database/civicai.sql`.
4. This creates the `civicai` database, all required tables, and pre-populates default demo accounts.

### 2. Backend Setup
1. Copy or link the project folder into `htdocs`: `C:\xampp\htdocs\civic ai`.
2. Ensure Apache `mod_rewrite` is enabled in `httpd.conf`.
3. Test backend health at `http://localhost/civic%20ai/backend/analytics`.

### 3. Frontend Setup
1. Open terminal inside `frontend/` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your web browser.

---

## Pre-configured Demo User Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@civicai.gov` | `Admin123!` | Full system governance, user management & analytics |
| **Roads Officer** | `road.officer@civicai.gov` | `Officer123!` | Public Works & Roads department desk |
| **Water Officer** | `water.officer@civicai.gov` | `Officer123!` | Water Supply & Sewerage department desk |
| **Citizen User** | `citizen@civicai.gov` | `Citizen123!` | Public citizen ticket filing portal |

---

## Key Features

1. **Automated AI Complaint Classification**:
   - Analyzes title and description upon submission.
   - Categorizes into 10 municipal categories (Road, Water, Electricity, Garbage, Drainage, Health, Education, Transport, Government Office, Others).
   - Assigns urgency priority (`Low`, `Medium`, `High`, `Critical`).
   - Generates executive AI summary and officer action plan.

2. **Voice Dictation & GPS Location Selector**:
   - Hands-free speech recognition voice dictation for complaint descriptions.
   - GPS position acquisition and landmark presets.

3. **Officer Field Resolution & Proof Upload**:
   - Field officers inspect assigned complaints and update status (`In Progress`, `Resolved`, `Rejected`).
   - Requires uploading photo proof of completed maintenance work.

4. **Analytics & Public SLA Reports**:
   - Interactive Chart.js graphs for monthly trends, priority pie breakdown, and department SLA resolution rates.
   - Geographic incident heat map visualization.
