import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import './SignUp.css';
import signupImage from '../../assets/images/Learner.png';
import googleLogo from '../../assets/images/google-logo.png';
import websiteLogo from '../../assets/images/website-logo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission for email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase auth profile
      await updateProfile(user, { displayName: fullName });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      });

      toast.success('Account created successfully!');
      navigate('/AiTools');
    } catch (error) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email is already in use.'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters.'
        : error.message;
      toast.error(errorMessage);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Store Google user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        fullName: user.displayName || '',
        createdAt: new Date().toISOString(),
      }, { merge: true }); // Use merge to avoid overwriting existing data

      toast.success('Signed up with Google!');
      navigate('/AiTools');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="website-logo" onClick={() => navigate('/')} role="button" aria-label="Go to homepage">
        <img src={websiteLogo} alt="Learn Smart Logo" />
      </div>
      <div className="signup-container">
        <div className="signup-box">
          <h2>Create Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-label="First Name"
                data-testid="firstName-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-label="Last Name"
                data-testid="lastName-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                data-testid="email-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                data-testid="password-input"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="toggle-password"
              >
                {showPassword ? <i class="fa-solid fa-eye-slash"></i> : <i class="fa-solid fa-eye"></i>}
              </span>
            </div>
            <button type="submit" className="signup-button" aria-label="Sign up" data-testid="signup-button">
              Continue
            </button>
            <p className="signup-signin-text">
              Already have an account? <Link to="/signin" data-testid="signin-link">Sign in</Link>
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
              aria-label="Sign up with Google"
              data-testid="google-signup-button"
            >
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
  );
};

export default SignUp;