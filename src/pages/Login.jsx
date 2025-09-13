import { useState } from "react";
import "../tailwind.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSignUp, setIsSignUp] = useState(false);
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
                            <input type="email" id="email" value={"email"} />
                        </div>

                        <div>

                        </div>

                        <button>

                        </button>
                    </form>

                </div>
            </div>
        </>
    );
}

export default Login;


// Inline styles for the component
const styles = {
    container: {

    },
    loginBox: {

    },
    title: {

    },
    form: {

    },
    inputGroup: {

    },
    label: {

    },
    input: {

    },
    button: {

    },
    buttonDisabled: {

    },
    message: {

    },
    switchText: {

    },
    switchButton: {

    },
};