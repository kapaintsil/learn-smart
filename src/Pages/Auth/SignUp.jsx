import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.js';
import { toast } from 'react-toastify';
import './SignUp.css';
import NavBar from '../../Components/NavBar';
import signupImage from '../../assets/images/Learner.png';
import googleLogo from '/icons/google-logo.png';
import websiteLogo from '/icons/website-logo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission for email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      toast.success('Account created successfully!');
      // navigate('/aitools');
      console.log(userCredential.user);
    } catch (error) {
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
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="website-logo" onClick={() => navigate('/')}>
        <img src={websiteLogo} alt="Website Logo" />
      </div>
      <div className="signup-container">
        <div className="signup-box">
          <h2>Create Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <div className="input-group password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <button type="submit" className="signup-button">
              Continue
            </button>
            <div  className="signup-login-text">
              <p>
                Already have an account? <Link to="/signin">Sign in</Link>
              </p>
            </div>
            <p className="or">
              <span><hr /></span>
              <span>OR</span>
              <span><hr /></span>
            </p>
            <button type="button" className="google-button" onClick={handleGoogleSignIn}>
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
        <div className="signup-image-container">
          <img src={signupImage} alt="Sign up illustration" className="signup-image" draggable={false} />
        </div>
      </div>
    </>
  )
};

export default SignUp;