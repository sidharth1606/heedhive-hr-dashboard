# Heedhive HR Dashboard

A full-stack HR Attendance & Analytics Management System built for **[Heedhive Agency](https://heedhive.in/)** — a digital marketing, SEO & web development company based in India.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS    |
| Backend    | Python Flask + Flask-JWT-Extended |
| Database   | MySQL + SQLAlchemy ORM            |
| Charts     | Chart.js + react-chartjs-2        |
| Auth       | JWT (JSON Web Tokens)             |
| Deployment | Render (API) + Vercel (Frontend)  |

---

## Features

- **JWT Authentication** — secure login with token-based auth
- **Dashboard** — real-time metrics: present today, absent, WFH, 30-day rate
- **Attendance Register** — mark P/A/WFH/Half per employee with bulk save
- **Employee Directory** — searchable, filterable, add new employees
- **Analytics** — doughnut breakdown, dept comparison bar chart, individual grading
- **CSV Export** — download attendance data for any date range
- **REST API** — fully documented endpoints for all features

---

## Project Structure

```
heedhive-hr-dashboard/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Shared components (Layout, Sidebar)
│   │   ├── pages/             # Dashboard, Attendance, Employees, Analytics
│   │   └── utils/api.js       # Axios instance with JWT interceptor
│   ├── package.json
│   └── vite.config.js
├── backend/                   # Flask REST API
│   ├── app.py                 # Entry point
│   ├── config.py              # Config (MySQL, JWT)
│   ├── models.py              # SQLAlchemy models
│   ├── routes/
│   │   ├── auth.py            # POST /api/auth/login
│   │   ├── employees.py       # CRUD /api/employees/
│   │   └── attendance.py      # Mark, bulk-mark, export /api/attendance/
│   └── requirements.txt
├── database/
│   ├── schema.sql             # MySQL table definitions
│   └── seed.sql               # Sample data for 8 Heedhive employees
└── README.md
```

---

## Getting Started

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p heedhive_hr < database/seed.sql
```

### 2. Backend (Flask)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

cp .env.example .env         # Fill in your MySQL credentials
python app.py
# API running at http://localhost:5000
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

### Default Login
| Email | Password |
|-------|----------|
| hr@heedhive.in | heedhive@123 |

---

## API Endpoints

| Method | Endpoint                     | Description             |
|--------|------------------------------|-------------------------|
| POST   | /api/auth/login              | Login, returns JWT      |
| GET    | /api/auth/me                 | Get current user        |
| GET    | /api/employees/              | List all employees      |
| POST   | /api/employees/              | Add new employee        |
| PUT    | /api/employees/:id           | Update employee         |
| GET    | /api/attendance/today        | Today's attendance      |
| POST   | /api/attendance/mark         | Mark single attendance  |
| POST   | /api/attendance/bulk-mark    | Bulk mark attendance    |
| GET    | /api/attendance/stats        | Attendance statistics   |
| GET    | /api/attendance/export       | Export CSV              |

---

## Deployment

**Backend → Render (Free)**
- Connect GitHub repo → select `backend/` as root
- Add environment variables from `.env.example`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

**Frontend → Vercel (Free)**
- Connect GitHub repo → select `frontend/` as root
- Set `VITE_API_URL` env var to your Render backend URL
- Auto-deploys on every push

---

## Built By

**G. Sidharth Ganapathi** — Data Analyst & Full-Stack Developer  
[GitHub](https://github.com/sidharth1606) · [LinkedIn](https://linkedin.com/in/sidharth-ganapathi-8a2a23292) · [Portfolio](https://sidharth1606.github.io)

---

*Built for Heedhive Agency, Tirunelveli, Tamil Nadu, India*
