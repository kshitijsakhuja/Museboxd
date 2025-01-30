import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css';

const SignIn = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        // Here you would typically handle authentication
        // If successful, navigate to the home page
        navigate('/HomePage'); // Redirect to home page
    };

    return (
        <div className="container">
            <div className="form-area">
                <h2>Sign in with email</h2>
                <p>Make a new doc to bring your work, data, and teams together. For free.</p>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                    <button type="submit" className="submit-button">Get Started</button>
                </form>
                <div className="social-login">
                    <button className="google-button">Sign in with Google</button>
                    <button className="apple-button">Sign in with Apple</button>
                </div>
                <p className="signup-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;