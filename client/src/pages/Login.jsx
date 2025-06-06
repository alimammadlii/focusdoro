import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // TODO: Implement actual login
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            padding: '20px' 
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    fontSize: '24px'
                }}>
                    Sign in to your account
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={{ 
                                width: '100%', 
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            style={{ 
                                width: '100%', 
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;