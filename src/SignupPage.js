import React from 'react';
import './SignupPage.css';

const SignupForm = () => {
    return (
        <div className="signup-form-container">
            <h2>Sign Up</h2>
            <form>
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default SignupForm;
