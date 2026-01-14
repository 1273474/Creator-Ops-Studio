# 🎬 CreatorOps Studio

> A premium brand deal management platform built for content creators who are tired of losing track of their brand collaborations.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)

---

## 🎯 The Problem

Content creators managing brand deals face a chaotic workflow:

- 📱 **WhatsApp hell** – Approval requests scattered across multiple chats
- 📧 **Email chaos** – Finding that one approval email from 2 weeks ago
- 📝 **Spreadsheet madness** – Tracking 15 deals across 3 different sheets
- 💸 **Missed payments** – Forgetting to follow up on ₹50,000 pending payments

**Result:** Creators lose money, miss deadlines, and burn out.

---

## 💡 The Solution

CreatorOps Studio brings **everything about your brand deals into one place**.

One mental model: **Everything revolves around a Deal.**

- Create a deal → Add deliverables → Get brand approval → Track payment
- All in 4 simple screens. No sidebar hell. No 15 pages.

---

## ✨ Key Features

### 📊 Dashboard with Kanban Board
See all your deals at a glance, organized by status:
```
Confirmed → In Production → Sent for Approval → Posted → Payment Pending → Paid
```

### 📄 Deal Page (The Core Screen)
Three-column layout with everything you need:

| Left | Center | Right |
|------|--------|-------|
| Deal Info | Deliverables | Brand Approval |
| Brand, Amount, Due Date | Upload links, Versions | Shareable approval link |

### 🔗 Brand Approval Page (Game Changer!)
- **No login required** for brands
- Share a secure link → Brand reviews → Approves or requests changes
- Comments are saved → Clear proof of approval
- Replaces WhatsApp/Email completely

### 💰 Payment Tracking
- Track payment amount and due date
- Status badges: Paid / Due Soon / Overdue

---

## 🏗️ Project Structure

```
CreatorOps Studio/
│
├── server/                 # Backend (Node.js + Express)
│   ├── server.js           # Entry point - starts Express server
│   ├── models/             # MongoDB schemas (User, Deal, Deliverable)
│   ├── routes/             # API endpoints
│   │   ├── auth.js         # Signup/Login
│   │   ├── deals.js        # CRUD for deals
│   │   ├── deliverables.js # Manage deliverables
│   │   └── public.js       # Brand approval (no auth needed)
│   └── middleware/
│       └── auth.js         # JWT verification
│
├── web/                    # Frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx      # Kanban board
│       │   ├── DealPage.jsx       # Single deal view
│       │   ├── BrandApproval.jsx  # Public approval page
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       ├── components/
│       │   └── DealCard.jsx       # Reusable deal card
│       ├── store/
│       │   └── useStore.js        # Zustand state management
│       └── api/
│           └── axios.js           # API client with auth header
│
└── README.md
```

---

## 🗄️ Database Design

### User
```javascript
{
  name: "Ravi Shankar",
  email: "ravi@example.com",
  password: "hashed_password",
  role: "CREATOR"  // or "ADMIN"
}
```

### Deal
```javascript
{
  userId: ObjectId,          // Owner of this deal
  brandName: "Nike",
  value: 50000,              // Payment amount
  dueDate: "2025-02-15",
  status: "IN_PRODUCTION",   // Kanban column
  shareToken: "abc123..."    // For brand approval link
}
```

### Deliverable
```javascript
{
  dealId: ObjectId,
  title: "YouTube Integration Video",
  link: "https://drive.google.com/...",
  version: 2,
  status: "SENT",  // DRAFT → SENT → APPROVED
  comments: [
    { text: "Please fix audio at 0:45", authorRole: "BRAND" }
  ]
}
```

---

## 🔄 How It Works

### Creator Flow
```
1. Creator signs up / logs in
2. Creates a new deal (Brand: Nike, Amount: ₹50,000)
3. Adds deliverables (YouTube video, Instagram reel)
4. Uploads draft links (Google Drive, YouTube unlisted)
5. Clicks "Send to Brand" → Status becomes SENT
6. Shares approval link with brand
```

### Brand Flow
```
1. Brand receives a secure link (no signup needed!)
2. Opens link → Sees all deliverables
3. Reviews each one
4. Clicks "Approve" or "Request Changes" (with comment)
5. Creator sees feedback instantly
```

### Approval Magic ✨
- When brand approves → Deliverable locks (no edits)
- All comments are timestamped → Proof of communication
- No more "I never approved this" arguments

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React 19 + Vite | Fast, modern, great DX |
| **Styling** | Tailwind CSS 4 | Utility-first, rapid styling |
| **State** | Zustand | Simple, no boilerplate |
| **Routing** | React Router 7 | Client-side navigation |
| **Icons** | Lucide React | Beautiful, consistent icons |
| **Backend** | Node.js + Express | JavaScript everywhere |
| **Database** | MongoDB Atlas | Flexible schema for deals |
| **Auth** | JWT + bcryptjs | Secure, stateless authentication |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/1273474/Creator-Ops-Studio.git
cd Creator-Ops-Studio
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-key-here
PORT=5001
```

### 3. Setup Frontend
```bash
cd ../web
npm install
```

### 4. Run the App

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server running on port 5001
# MongoDB Connected
```

**Terminal 2 (Frontend):**
```bash
cd web
npm run dev
# Local: http://localhost:5173
```

### 5. Open in Browser
Visit [http://localhost:5173](http://localhost:5173)

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Deals (Protected - requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deals` | Get all user's deals |
| POST | `/api/deals` | Create new deal |
| GET | `/api/deals/:id` | Get single deal |
| PATCH | `/api/deals/:id` | Update deal |
| DELETE | `/api/deals/:id` | Delete deal + deliverables |
| PATCH | `/api/deals/:id/status` | Update deal status |

### Deliverables (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deals/:id/deliverables` | Add deliverable to deal |
| PATCH | `/api/deliverables/:id` | Update deliverable |
| POST | `/api/deliverables/:id/comments` | Add comment |

### Public (Brand Approval - No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/deals/:token` | Get deal by share token |
| PATCH | `/api/public/deliverables/:id/status` | Approve/reject deliverable |

---

## 🎨 Design Philosophy

> **Simplicity comes from fewer concepts, not fewer features.**

- **4 screens only** – Dashboard, Deal Page, Approval Page, Auth
- **One mental model** – Everything is a Deal
- **Calm UI** – White/gray base, blue accent, soft shadows
- **Premium feel** – Rounded cards, subtle animations, clear typography

---

## 🔮 Future Roadmap

- [ ] Drag-and-drop Kanban
- [ ] Dashboard stats cards (Active, Pending, Overdue)
- [ ] Email notifications via Nodemailer
- [ ] Settings page (profile, team management)
- [ ] Mobile responsive design
- [ ] Payment reminder automation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for content creators who deserve better tools
</p>
