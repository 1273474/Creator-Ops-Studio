import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '../api/api';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');


    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setError('');

        try {
            const response = api.post('/auth/login', { email, password });
            localStorage.setItem(response.data.token);
            navigate('/dashboard');

        }
        catch (err) {
            setError(
                err.response?.data?.message || 'Login failed. Please try again.'
            );
            
        } finally {
            // This runs whether success OR error
            setLoading(false);

        }

    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back!</h1>
                <p className="subtitle">Sign in to CreatorOps</p>

                {/* Show error if exists */}
                {error && <div className="error-message">{error}</div>}

                {/* 
                    THE FORM
                    onSubmit = What happens when user clicks Login button
                */}
                <form onSubmit={handleSubmit}>
                    {/* 
                        EMAIL INPUT
                        name="email" - This becomes e.target.name in handleChange
                        value={email} - Controlled input (React controls the value)
                        onChange={handleChange} - Runs on every keystroke
                    */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* 
                        SUBMIT BUTTON
                        disabled={loading} - Can't click while loading
                    */}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Link to register page */}
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>

    );





}

export default LoginPage;