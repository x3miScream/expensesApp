import React, {useState} from 'react';
import { DollarSign } from 'lucide-react';
import { DUMMY_CREDENTIALS } from '../../data/dummyData.jsx';
import useAuth from '../../Hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Context/AuthContext.jsx';

import './LoginScreen.css';

// --- Login Component ---

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();
    const {setAuthUser} = useAuthContext();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const loginDto = {
            userEmail: email,
            password: password
        };

        const loginPromise = login(loginDto);

        loginPromise
            .then((data) => {
                console.log('yes');
                console.log(data);
            })
            .catch((error) => {
                setError('Invalid credentials.');
            })
            .finally(() => {
                setIsLoading(false);
                navigate("/")
            });
    };

    const handleAuthOld = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (isRegistering) {
            // For dummy auth, we don't support real registration, just simulate error/success
            if (email.length > 5 && password.length >= 6) {
                // Simulate success then redirect to login
                setError(null);
                setIsRegistering(false);
                alert("Simulated registration successful! Please log in."); // Using alert for simplicity in this dummy context.
            } else {
                setError('Simulated registration failed: Ensure email is valid and password is at least 6 characters.');
            }
        } else {
            // DUMMY LOGIN LOGIC: Check against hardcoded credentials
            if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
                onLogin(DUMMY_CREDENTIALS.dummyUser);
            } else {
                setError('Invalid credentials. Use test@flo.pay / password123 to log in.');
            }
        }
        
        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <DollarSign className="w-10 h-10 mx-auto mb-4 text-indigo-600" style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 1rem', color: '#4f46e5' }} />
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {isRegistering ? 'Create Dummy Account' : 'Welcome Back'}
                </h1>
                <p className="text-gray-500 mb-6">Sign in to manage your budget effortlessly.</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <input
                            type="email"
                            placeholder={`Email Address (Use ${DUMMY_CREDENTIALS.email})`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder={`Password (Use ${DUMMY_CREDENTIALS.password})`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ padding: '0.75rem 1rem', marginTop: '0.5rem' }}
                    >
                        {isLoading ? (
                            'Processing...'
                        ) : isRegistering ? (
                            'Simulate Sign Up'
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-600">
                    {isRegistering ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(false); setError(null); }}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                style={{ color: '#4f46e5', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                            >
                                Sign In
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(true); setError(null); }}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                style={{ color: '#4f46e5', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                            >
                                Simulate Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;