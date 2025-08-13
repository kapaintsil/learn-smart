import React, { useState } from 'react';
import './SignIn.css';
import NavBar from '../../Components/NavBar';
import signupImage from '../../assets/images/Learner.png';
import googleLogo from '/icons/google-logo.png';
import websiteLogo from '/icons/website-logo.png';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState('');

  const handleFakeSignIn = (e) => {
    e.preventDefault();
    navigate('/AiTools');
  };

  const handleFakeGoogleSignIn = () => {
    navigate('/AiTools');
  };

  return (
    <div>
      <div className="website-logo" onClick={() => navigate('/')}>
        <img src={websiteLogo} alt="Website Logo" />
      </div>

      <div className="signup-container">
        <div className="signup-box">
          <h2>Welcome Back</h2>
          <form className="signup-form" onSubmit={handleFakeSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-field">
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

            <button type="submit" className="signup-button">Continue</button>

            {error && <p className="error-text">{error}</p>}

            <p className="signup-login-text">
              Don’t have an account? <a href="/login">Sign up</a>
            </p>

            <p className="or">
              <span><hr /></span>
              <span>OR</span>
              <span><hr /></span>
            </p>

            <button type="button" className="google-button" onClick={handleFakeGoogleSignIn}>
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        <div className='signup-image-container'>
          <img src={signupImage} alt="Sign in visual" className="signup-image" />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
