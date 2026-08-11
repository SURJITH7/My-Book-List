import bg from '../Landing/landing_bg.jpg'
import styles from './Auth.module.css'
import stylesLanding from '../Landing/Landing.module.css'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Firebase/firebase';
import { useState, useEffect } from 'react';

const Auth = ({ user }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Safe redirect using useEffect
    useEffect(() => {
        if (user) window.location = '/home';
    }, [user]);

    const handleMethodChange = () => {
        setIsSignUpActive(prev => !prev);
        setError(""); // clear errors on mode switch
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // ✅ Send Firebase token instead of raw password
            const token = await userCredential.user.getIdToken();

            const response = await fetch('http://localhost:5000/db/submit/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userName: userName.toLowerCase(), email })
            });

            if (response.ok) {
                window.location = '/home';
            } else {
                await userCredential.user.delete(); // rollback Firebase user
                if (response.status === 409) throw new Error('Username already taken.');
                else if (response.status === 408) throw new Error('Email already exists.');
                else throw new Error('Sign up failed. Please try again.');
            }
        } catch (error) {
            // ✅ Handle Firebase-specific errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.'); break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters.'); break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.'); break;
                default:
                    setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location = '/home';
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email.'); break;
                case 'auth/wrong-password':
                    setError('Incorrect password.'); break;
                case 'auth/too-many-requests':
                    setError('Too many attempts. Please try again later.'); break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password.'); break;
                default:
                    setError('Sign in failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSignUpActive) handleSignUp();
        else handleSignIn();
    };

    return (
        <>
            <div className={stylesLanding.image}>
                <img className={stylesLanding.backgroundImg} src={bg} />
                <div className={stylesLanding.welcome}>
                    <form onSubmit={handleSubmit}>
                        {isSignUpActive
                            ? <p className={stylesLanding.welcomeMessage}>Sign Up</p>
                            : <p className={stylesLanding.welcomeMessage}>Log In</p>
                        }

                        {/* ✅ Show error message inline instead of alert() */}
                        {error && <p className={styles.error}>{error}</p>}

                        {isSignUpActive && (
                            <div className={styles.prompt}>
                                <input type="text" id="username" value={userName}
                                    placeholder='Username' onChange={e => setUserName(e.target.value)} required />
                            </div>
                        )}
                        <div className={styles.prompt}>
                            <input type="email" id="email" value={email}
                                placeholder='Email' onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className={styles.prompt}>
                            <input type="password" id="password" value={password}
                                placeholder='Password' onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <div className={stylesLanding.buttons}>
                            {/* ✅ Disable button while loading */}
                            <button type="submit" disabled={loading}>
                                {loading ? 'Please wait...' : (isSignUpActive ? 'Sign Up' : 'Log In')}
                            </button>
                        </div>
                    </form>

                    <a onClick={handleMethodChange} style={{ cursor: 'pointer' }}>
                        {isSignUpActive ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </a>
                </div>
            </div>
        </>
    );
};

export default Auth;