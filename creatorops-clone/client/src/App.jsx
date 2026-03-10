// ═══════════════════════════════════════════════════════════════════════════════
// APP.JSX - The main component that sets up routing
// ═══════════════════════════════════════════════════════════════════════════════
//
// This is like server.js for the frontend:
// - server.js:  app.use('/api/auth', authRoutes)
// - App.jsx:    <Route path="/login" element={<LoginPage />} />
//

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import our pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Import CSS
import './App.css';

function App() {
    return (
        // BrowserRouter = Enables routing in our app
        <BrowserRouter>
            {/* Routes = Container for all Route definitions */}
            <Routes>
                {/* 
                    Each Route = "When URL matches this path, show this component"
                    
                    path="/"          → Show when URL is http://localhost:5173/
                    path="/login"     → Show when URL is http://localhost:5173/login
                    path="/dashboard" → Show when URL is http://localhost:5173/dashboard
                */}

                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Auth pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Dashboard (protected - we check token inside the component) */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* 404 - Any other URL */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;