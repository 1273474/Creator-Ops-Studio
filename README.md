# Creator Ops Studio 🎨🚀

**Creator Ops Studio** is a comprehensive dashboard designed for content creators to manage their brand deals, track deliverables, and handle payments efficiently. It specifically replaces generic tools like Notion or spreadsheets with a workflow tailored for the creator economy.

## ✨ Features

*   **Deal Management (Kanban Board)**: Visualize deals across different stages: Confirmed, In Production, Sent for Approval, Posted, Payment Pending, and Paid.
*   **Deliverable Tracking**: Granular tracking of specific deliverables (e.g., "1 Reel", "2 YT Shorts") within each deal.
*   **Brand Approval Workflow**: Dedicated "Share with Brand" links that allow external stakeholders to review content without logging in.
*   **Automated Status Transitions**:
    *   Sending a deliverable to a brand automatically moves the deal to **"Sent for Approval"**.
*   **Flexible Workflows**:
    *   Create drafts without links.
    *   Inline editing for deliverables.
    *   Manual status overrides when needed.
*   **Secure Authentication**: JWT-based authentication for creators.

## 🛠️ Tech Stack

### Backend
*   **Node.js & Express**: Robust REST API.
*   **MongoDB & Mongoose**: Flexible schema design for Deals and Deliverables.
*   **JWT (JSON Web Tokens)**: Secure stateless authentication.
*   **Zod**: Runtime schema validation.

### Frontend
*   **React (Vite)**: Fast, modern frontend framework.
*   **Tailwind CSS**: Utility-first styling for a custom, premium design.
*   **Zustand**: Lightweight state management.
*   **Lucide React**: Beautiful, consistent iconography.
*   **Axios**: HTTP client for API requests.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd creator-ops-studio
```

### 2. Backend Setup
Navigate to the root directory and install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
node server.js
```
The server will run on `http://localhost:5001`.

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
creator-ops-studio/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # Axios setup
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages (Dashboard, DealPage, etc.)
│   │   └── store/         # Zustand store
│   └── ...
├── models/                 # Mongoose Models (Deal, Deliverable, User)
├── routes/                 # Express API Routes
├── middleware/             # Auth middleware
├── server.js               # Backend Entry Point
└── ...
```

## 🛡️ Security Note
This project uses `.gitignore` to ensure sensitive files like `.env` and `node_modules` are not committed to the repository. Please ensure you configure your local environment variables correctly before running.

## 📄 License
[ISC](LICENSE)
