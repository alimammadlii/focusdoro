import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const inputStyles = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
};

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            console.log('Login successful:', response.data);
            navigate('/'); // Redirect to home page after login
        } catch (error) {
            console.error('Login error:', error.response?.data);
            setError(error.response?.data?.message || 'Login failed');
        }
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
                {error && (
                    <div style={{ 
                        marginBottom: '15px', 
                        padding: '10px', 
                        backgroundColor: '#f8d7da', 
                        color: '#721c24', 
                        borderRadius: '4px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ width: '100%' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={inputStyles}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ width: '100%' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                style={inputStyles}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '16px',
                                    opacity: 0.6,
                                    zIndex: 1
                                }}
                            >
                                {showPassword ? '👁️' : '👁️'}
                            </button>
                        </div>
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
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px',
                    fontSize: '14px'
                }}>
                    Don't have an account?{' '}
                    <Link 
                        to="/register" 
                        style={{
                            color: '#4F46E5',
                            textDecoration: 'none'
                        }}
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;