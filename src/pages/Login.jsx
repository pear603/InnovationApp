import { use, useState } from "react";
// import "../tailwind.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';

function Login() {
    const navigate = useNavigate();
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();

        if (isSignUp) {
            if (!username || !email || !password) {
                setMessage({ text: 'Please fill in all fields', type: 'error' })
                return;
            }
        } else {
            if (!loginIdentifier || !password) {
                setMessage({ text: 'Please fill in all fields', type: 'error' });
                return;

            }
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            if (isSignUp) {
                // Check if username or email already exists
                const { data: existingUsers, error: checkError } = await supabase
                    .from('Financial Planner')
                    .select('username, email')
                    .or(`username.eq.${username},email.eq.${email}`);

                if (checkError) {
                    setMessage({ text: 'Error checking existing users', type: 'error' });
                    setLoading(false);
                    return;
                }

                if (existingUsers && existingUsers.length > 0) {
                    const usernameExists = existingUsers.some(user => user.username === username);
                    const emailExists = existingUsers.some(user => user.email === email);

                    if (usernameExists && emailExists) {
                        setMessage({ text: 'Username and email already exist', type: 'error' });
                    } else if (usernameExists) {
                        setMessage({ text: 'Username already exists', type: 'error' });
                    } else if (emailExists) {
                        setMessage({ text: 'Email already exists', type: 'error' });
                    }
                    setLoading(false);
                    return;
                }

                // Proceed with signup if no duplicates found
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    setMessage({ text: error.message, type: 'error' });
                } else {
                    const { error: dbError } = await supabase
                        .from('Financial Planner')
                        .insert([
                            {
                                User_id: data.user.id,
                                username: username,
                                email: email,
                                created_at: new Date().toISOString()
                            }
                        ]);
                    if (dbError) {
                        setMessage({ text: dbError.message, type: 'error' });
                    } else {
                        setMessage({
                            text: 'Sign up successful! Please check your email for confirmation',
                            type: 'success'
                        });
                        setTimeout(() => navigate("/walletlist"), 2000);
                    }
                }
            } else {
                let authError = null;
                let authData = null;

                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

                if (isEmail) {
                    const result = await supabase.auth.signInWithPassword({
                        email: loginIdentifier,
                        password,
                    });
                    authData = result.data;
                    authError = result.error;
                } else {
                    const { data: userData, error: userError } = await supabase
                        .from('Financial Planner')
                        .select("email")
                        .eq('username', loginIdentifier)
                        .single();

                    if (userError) {
                        setMessage({ text: 'Invalid username or password', type: 'error' });
                        setLoading(false);
                        return;
                    }

                    if (userData && userData.email) {
                        const result = await supabase.auth.signInWithPassword({
                            email: userData.email,
                            // .
                            password: password,
                        });
                        authData = result.data;
                        authError = result.error;
                    } else {
                        setMessage({ text: 'Invalid username or password', type: 'error' });
                        setLoading(false);
                        return;
                    }
                }
                if (authError) {
                    setMessage({ text: authError.message, type: 'error' });
                } else {
                    setMessage({ text: 'Login successful!', type: 'success' });
                    navigate("/walletlist");
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
                        {isSignUp ? (
                            <>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="username" style={styles.label}>Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={styles.input}
                                        placeholder="Choose a username"
                                        disabled={loading}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="email" style={styles.label}>Email</label>
                                    <input type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={styles.input}
                                        placeholder="Enter your email" />
                                </div>
                            </>

                        ) : (
                            <div>
                                <label htmlFor="loginIdentifier" style={styles.label}>
                                    Username or Email
                                </label>
                                <input
                                    type="text"
                                    id="loginIdentifier"
                                    value={loginIdentifier}
                                    onChange={(e) => setLoginIdentifier(e.target.value)}
                                    style={styles.input}
                                    placeholder="Enter your username or email"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your password" />
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
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setMessage({ text: '', type: '' });
                                setLoginIdentifier('');
                            }}
                            style={styles.switchButton}
                            disabled={loading}
                        >
                            {isSignUp ? 'Login' : 'Sign Up'}
                        </button>
                    </p>
                    {!isSignUp && (
                        <p style={styles.note}>
                            You can login with either your username or email address
                        </p>
                    )}
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
    note: {
        textAlign: 'center',
        marginTop: '1rem',
        color: '#888',
        fontSize: '12px',
    }
};