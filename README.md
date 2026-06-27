# DocAssign — AI-Assisted Doctor Assignment System

A full-stack healthcare workflow system where patients upload medical reports, AI analyzes the transcript, and the system automatically assigns the most suitable doctor category.

---

## Live Demo

- **Frontend:** https://doc-assign-g1ev.vercel.app
- **Backend API:** https://docassign-backend.onrender.com

---

## Test Credentials

| Role    | Email                      | Password   |
|---------|----------------------------|------------|
| Admin   | admin@docassign.com        | admin123   |
| Doctor  | ortho@docassign.com        | doctor123  |
| Patient | patient@docassign.com      | patient123 |

### All Doctor Accounts
| Specialization   | Email                  | Password   |
|-----------------|------------------------|------------|
| Dermatologist   | derma2@docassign.com   | doctor123  |
| Cardiologist    | cardio@docassign.com   | doctor123  |
| Orthopedic      | ortho@docassign.com    | doctor123  |
| General Physician | general@docassign.com | doctor123  |
| Neurologist     | neuro@docassign.com    | doctor123  |

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React.js, Vite, Tailwind CSS                      |
| Backend    | Node.js, Express.js                               |
| Database   | PostgreSQL (Neon) + Prisma ORM                    |
| Auth       | JWT + bcryptjs                                    |
| File Upload| Multer                                            |
| OCR        | Tesseract.js (images), pdf-parse (PDFs)           |
| AI         | NVIDIA NIM API (Llama 3.1) + Rule-based fallback  |
| Deployment | Vercel (frontend) + Render (backend)              |

---

## AI Tool Used

Claude (Anthropic) — used for code guidance, architecture planning, and debugging.

---

## What I Built

- **Patient flow** — Register, login, upload prescription/report (JPG/PNG/PDF), view extracted transcript, view AI-assigned doctor
- **Admin flow** — View all patients and reports, manually assign/reassign doctors, trigger reanalysis
- **Doctor flow** — View assigned reports, read transcript and AI routing reason, mark case as reviewed
- **AI Classification** — NVIDIA NIM API (Llama 3.1) analyzes transcript and returns structured JSON with suggested doctor category, confidence, urgency, reason, and keywords
- **Fallback Engine** — Rule-based keyword classifier activates automatically if NVIDIA API fails
- **OCR** — Tesseract.js for image reports, pdf-parse for PDF reports
- **RBAC** — Role-based access control; patients cannot access other patients data, doctors only see assigned reports

---

## What Is Pending

- Flutter mobile app (bonus feature from spec)
- Video consultation module
- Email notifications on doctor assignment

---

## Project Structure

```
DocAssign/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── auth/      # Login, Register pages
│   │   ├── context/   # AuthContext
│   │   ├── pages/     # Patient, Admin, Doctor pages
│   │   └── components/# Shared components
│   └── .env
└── backend/           # Node.js + Express
    ├── prisma/        # Schema + migrations
    ├── src/
    │   ├── middleware/ # JWT auth + role check
    │   ├── routes/    # auth, reports, doctors, admin, doctorRoutes
    │   └── services/  # AI classifier service
    └── uploads/       # Uploaded report files
```

---

## Setup Instructions (Local)

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/NikhilRautela/DocAssign.git
cd DocAssign
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=docassign_secret_key_123
PORT=5000
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

Run migrations and start:

```bash
npx prisma generate
npx prisma db push
node src/index.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Main Workflow

```
Patient login
  → Upload report (image or PDF)
  → System extracts text (OCR / pdf-parse)
  → NVIDIA AI or fallback analyzes transcript
  → Doctor category assigned automatically
  → Admin can review and manually reassign
  → Doctor marks case as reviewed
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/reports/upload | Upload report |
| POST | /api/reports/:id/extract-text | Run OCR |
| POST | /api/reports/:id/analyze | Run AI analysis |
| GET | /api/reports/my | Patient reports |
| GET | /api/admin/reports | All reports (admin) |
| PATCH | /api/admin/reports/:id/assign-doctor | Manual assignment |
| POST | /api/admin/reports/:id/reanalyze | Rerun AI |
| GET | /api/doctor/reports | Doctor assigned reports |
| PATCH | /api/doctor/reports/:id/mark-reviewed | Mark reviewed |

---

## Submission

| Field | Details |
|-------|---------|
| Name | Nikhil Singh Rautela |
| Role Applied | Full-Stack Developer Intern |
| GitHub | https://github.com/NikhilRautela/DocAssign |
| Demo | https://doc-assign-glev.vercel.app |
| Tech Stack | React, Vite, Node.js, Express, Prisma, PostgreSQL, NVIDIA NIM API |
| AI Tool Used | Claude (Anthropic) |
| What Is Pending | Flutter mobile app, email notifications |
