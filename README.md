# 🎯 AI-Assisted Job Application Tracker

A full-stack web app where users track their job applications on a **Kanban board**. Paste any job description and the built-in AI automatically parses it to **auto-fill application details** (company, role, skills, seniority, location) and **generate tailored resume suggestions** — powered by Google Gemini AI.

## ✨ Features

### AI-Powered Capabilities
- **Job Description Parsing** — Automatically extracts structured data (company name, role, required skills, experience level, salary range) from raw job description text using Google Gemini AI.
- **Resume Point Generation** — Generates 3–5 tailored resume bullet points matched to each job description.
- **Streaming Support** — Real-time streaming variants of AI services for progressive content updates.

### Application Management
- **Kanban Board** — Visual drag-and-drop pipeline with columns: Applied → Phone Screen → Interview → Offer → Rejected.
- **Application CRUD** — Create, read, update, and delete job applications.
- **Application Modal** — Detailed view of each application showing position details, required skills, AI-generated resume points, status management, and notes.
- **Status Tracking** — Update application status via dropdown or drag-and-drop between Kanban columns.
- **Notes** — Add and save personal notes on each application.

### Dashboard & Analytics
- **Dashboard Statistics** — Real-time stats cards showing total applications, count per status, and success rate (offers / total).
- **Follow-Up Reminders** — Automatic reminders for applications in "Applied" status that are older than 7 days.

### Search, Filter & Export
- **Search** — Filter applications by company name or position.
- **Status Filter** — Filter the Kanban board by application status.
- **Date Filter** — Filter by time period (Today, This Week, This Month, All Time).
- **CSV Export** — Export all application data to a CSV file.

### Authentication & Security
- **User Registration & Login** — Secure account creation and authentication.
- **JWT Authentication** — Token-based auth with 7-day expiry, stored in `localStorage`.
- **Password Hashing** — Passwords hashed with bcrypt (salt rounds: 10) before storage.
- **Protected Routes** — Dashboard and API endpoints are accessible only to authenticated users.

### UI / UX
- **Dark / Light Mode** — Toggle between themes with system preference detection and persistence via `localStorage`.
- **Responsive Design** — Styled with Tailwind CSS and custom CSS.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **TypeScript** | Type-safe server code |
| **MongoDB + Mongoose** | Database and ODM |
| **JSON Web Tokens** | Authentication |
| **bcryptjs** | Password hashing |
| **Google Generative AI (Gemini 2.5 Flash)** | Job description parsing and resume generation |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript + JSX** | Type-safe components |
| **Vite** | Build tool and dev server |
| **React Router v7** | Client-side routing |
| **TanStack React Query** | Server state management |
| **Axios** | HTTP client |
| **Tailwind CSS 4** | Utility-first styling |

---

## 📡 API Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT |

#### Register — `POST /api/auth/register`
**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response (201):**
```json
{
  "user": { "id": "string", "name": "string", "email": "string" },
  "token": "JWT string"
}
```

#### Login — `POST /api/auth/login`
**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response (200):**
```json
{
  "user": { "id": "string", "name": "string", "email": "string" },
  "token": "JWT string"
}
```

### Applications (`/api/applications`) — _All routes require JWT_

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/applications/add` | Yes | Create a new application (AI parses the JD) |
| `GET` | `/api/applications` | Yes | Get all applications for the logged-in user |
| `PUT` | `/api/applications/:id` | Yes | Update an application (status, notes, etc.) |
| `DELETE` | `/api/applications/:id` | Yes | Delete an application |

#### Create Application — `POST /api/applications/add`
**Headers:** `Authorization: Bearer <token>`

**Request body:**
```json
{
  "jd": "Full job description text..."
}
```
**Response (200):**
```json
{
  "app": {
    "_id": "string",
    "userId": "string",
    "company": "string",
    "role": "string",
    "skills": ["string"],
    "niceToHave": ["string"],
    "seniority": "string",
    "location": "string",
    "resumePoints": ["string"],
    "status": "Applied",
    "dateApplied": "ISO date",
    "jobDescription": "string"
  },
  "suggestions": ["Resume bullet point 1", "Resume bullet point 2"]
}
```

#### Get All Applications — `GET /api/applications`
**Headers:** `Authorization: Bearer <token>`

**Response (200):** Array of application objects sorted by `dateApplied` descending.

#### Update Application — `PUT /api/applications/:id`
**Headers:** `Authorization: Bearer <token>`

**Request body:** Any fields to update, e.g.:
```json
{
  "status": "Interview",
  "notes": "Had a great call with the hiring manager"
}
```
**Response (200):** Updated application object.

#### Delete Application — `DELETE /api/applications/:id`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "msg": "Application deleted successfully"
}
```

---

## 📁 Project Structure

```
AI-assisted-Job-Application-Tracker/
├── src/                          # Backend source code
│   ├── server.ts                 # Express server entry point
│   ├── routes/
│   │   ├── authRoutes.ts         # Auth routes (register, login)
│   │   └── applicationRoutes.ts  # Application CRUD routes
│   ├── controllers/
│   │   ├── authController.ts     # Auth request handlers
│   │   └── applicationController.ts  # Application request handlers
│   ├── services/
│   │   ├── authService.ts        # User registration & login logic
│   │   └── aiService.ts          # Gemini AI integration (parsing, resume points)
│   ├── models/
│   │   ├── User.ts               # User schema (name, email, hashed password)
│   │   └── Application.ts        # Application schema (company, role, skills, status, etc.)
│   └── middleware/
│       └── auth.ts               # JWT authentication middleware
├── frontend/                     # Frontend source code
│   ├── src/
│   │   ├── App.tsx               # Root component with routing
│   │   ├── api.ts                # Axios API client
│   │   ├── pages/
│   │   │   ├── Register.tsx      # Registration page
│   │   │   ├── Login.tsx         # Login page
│   │   │   └── Dashboard.tsx     # Main dashboard page
│   │   ├── components/
│   │   │   ├── AddApplication.tsx    # Job description input form
│   │   │   ├── Kanban.tsx            # Drag-and-drop Kanban board
│   │   │   ├── ApplicationModal.tsx  # Application detail / edit modal
│   │   │   ├── DashboardStats.tsx    # Statistics cards
│   │   │   ├── FollowUpReminders.tsx # Follow-up reminder alerts
│   │   │   ├── KanbanFilter.tsx      # Search, filter, and export controls
│   │   │   └── ProtectedRoute.tsx    # Auth guard for protected pages
│   │   ├── utils/
│   │   │   ├── exportUtils.ts    # CSV export utility
│   │   │   └── themeUtils.ts     # Dark / light mode utilities
│   │   └── styles/               # Component-specific CSS files
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example                  # Environment variable template
├── package.json                  # Backend dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** instance (local or MongoDB Atlas)
- **Google Gemini API key** (for AI features)

### 1. Clone the repository
```bash
git clone https://github.com/Rahul-tech12/AI-assisted-Job-Application-Tracker.git
cd AI-assisted-Job-Application-Tracker
```

### 2. Configure environment variables
Copy the example file and fill in your values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Backend server port (default: `5000`) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `FRONTEND_URL` | Frontend URL for CORS |
| `CORS_ORIGIN` | Allowed CORS origin |

### 3. Install dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 4. Run the application
```bash
# Run both backend and frontend concurrently
npm run dev

# Or run them separately:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:5173
```

---

## 📝 Data Models

### User
| Field | Type | Description |
|---|---|---|
| `name` | String | User's full name |
| `email` | String | Unique email address |
| `password` | String | Bcrypt-hashed password |
| `createdAt` | Date | Account creation timestamp |

### Application
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Reference to the owning user |
| `company` | String | Company name (AI-extracted) |
| `role` | String | Job title / position (AI-extracted) |
| `skills` | [String] | Required skills (AI-extracted) |
| `niceToHave` | [String] | Nice-to-have skills (AI-extracted) |
| `seniority` | String | Experience / seniority level (AI-extracted) |
| `location` | String | Job location (AI-extracted) |
| `resumePoints` | [String] | AI-generated resume bullet points |
| `status` | String | One of: Applied, Phone Screen, Interview, Offer, Rejected |
| `notes` | String | User's personal notes |
| `dateApplied` | Date | Date the application was recorded |
| `jobDescription` | String | Original raw job description text |

---

## 🔮 Scope & Future Enhancements

- **Resume Upload & Matching** — Upload a resume and get a match score against each job description.
- **Email Notifications** — Automated email reminders for follow-ups and status changes.
- **Interview Prep** — AI-generated interview questions based on the job description and required skills.
- **Analytics Dashboard** — Charts and graphs showing application trends, response rates, and timelines.
- **Browser Extension** — One-click job saving from job boards (LinkedIn, Indeed, etc.).
- **Collaborative Sharing** — Share application boards with mentors or career coaches.
- **Calendar Integration** — Sync interview dates with Google Calendar or Outlook.
- **Multi-language Support** — Internationalization for non-English job descriptions and UI.

---

## 📄 License

ISC
