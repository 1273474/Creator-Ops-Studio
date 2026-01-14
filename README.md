# CreatorOps Studio

A premium brand deal management platform for content creators. Track deals, manage deliverables, get brand approvals - all in one place.

## 🏗️ Project Structure

```
Creator Ops Studio/
├── server/          # Backend (Node.js + Express + MongoDB)
│   ├── server.js    # Entry point
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── .env         # Environment variables
│
├── web/             # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── store/       # Zustand state
│   │   └── api/         # Axios config
│   └── package.json
│
├── playground/      # Learning & experimentation files
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../web
npm install
```

### 2. Environment Setup

Create `server/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
```

### 3. Run the App

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | Kanban board with all deals |
| **Deal Page** | 3-column layout: Info, Deliverables, Approvals |
| **Approval Page** | Brand-facing review page (no login required) |
| **Auth** | Login & Signup pages |

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📊 Database Schema

### User
```
{ name, email, password, role }
```

### Deal
```
{ userId, brandName, value, dueDate, status, shareToken }
```

### Deliverable
```
{ dealId, title, link, version, status, comments[] }
```

## 🔐 API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Deals (protected)
- `GET /api/deals` - All user deals
- `POST /api/deals` - Create deal
- `GET /api/deals/:id` - Get deal
- `PATCH /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Deliverables (protected)
- `POST /api/deals/:id/deliverables` - Add deliverable
- `PATCH /api/deliverables/:id` - Update deliverable

### Public (brand approval)
- `GET /api/public/deals/:token` - Get deal by share token
- `PATCH /api/public/deliverables/:id/status` - Approve/reject

---

Built with ❤️ for content creators
