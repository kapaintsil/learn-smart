import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import './SignIn.css';
import signinImage from '../../assets/images/Learner.png';
import googleLogo from '../../assets/images/google-logo.png';
import websiteLogo from '../../assets/images/website-logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle email/password sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      navigate('/aitools');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google!');
      navigate('/aitools');
    } catch (error) {
      setError(error.message);
      toast.error(error.message)
    }
  };

  return (
    <>
      <div className="website-logo" onClick={() => navigate('/')}>
        <img src={websiteLogo} alt="Learn Smart Logo" />
      </div>
      <div className="signin-container">
        <div className="signin-box">
          <h2>Welcome Back</h2>
          <form className="signin-form" onSubmit={handleSignIn}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </div>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <button type="submit" className="signin-button" aria-label="Sign in">
              Continue
            </button>
            <p className="signin-signup-text">
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
            <p className="or">
              <span><hr /></span>
              <span>OR</span>
              <span><hr /></span>
            </p>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
              aria-label="Sign in with Google"
            >
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
        <div className="signin-image-container">
          <img src={signinImage} alt="Sign in illustration" className="signin-image" />
        </div>
      </div>
    </>
  );
};

export default SignIn;