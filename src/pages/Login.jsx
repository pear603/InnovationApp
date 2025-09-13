import { useState } from "react";
import "../tailwind.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage({ text: 'Please fill in all fields', type: 'error' })
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            let error;
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                error = signUpError;

                if (!error) {
                    setMessage({
                        text: 'Sign up successful! Please check your email for confirmation',
                        type: 'success'
                    });
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                error = signInError

                if (!error) {
                    setMessage({ text: 'Login successful', type: 'success' });
                }
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={styles.container}>
                <div style={styles.loginBox}>
                    <h2 style={styles.title}>
                        {isSignUp ? 'Create Account' : 'Login'}
                    </h2>
                    {/* if there is message thats not default state, render after && (Which is always truthy)*/}
                    {message.text && (
                        <div style={{
                            ...styles.message,
                            backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                            color: message.type === 'error' ? '#c62828' : '#2e7d32'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAuth} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your email" />
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Enter youe password" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        >
                            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                        </button>
                    </form>

                    <p style={styles.switchText}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={styles.switchButton}
                        >
                            {isSignUp ? 'Login' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;


// Inline styles for the component
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    loginBox: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: '0.5rem',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    message: {
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    switchText: {
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#666',
    },
    switchButton: {
        background: 'none',
        border: 'none',
        color: '#4361ee',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginLeft: '0.5rem',
    },
};