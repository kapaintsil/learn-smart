import React from 'react';
import './SignIn.css';
import NavBar from '../../Components/NavBar';
import signupImage from '../../assets/images/Learner.png';
import googleLogo from '../../assets/icons/google-logo.png';
import websiteLogo from '../../assets/icons/website-logo.png';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();

  return (
    <>
      <div className="website-logo" onClick={() => navigate('/')}>
        <img src={websiteLogo} alt="Website Logo" />
      </div>

      <div className="signup-container">
        <div className="signup-box">
          <h2>Welcome Back</h2>
          <form className="signup-form">
            <input type="email" placeholder="Email or Phone" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="signup-button">Continue</button>

            <p className="signup-login-text">
              Don’t have an account? <a href="/login">Sign up</a>
            </p>

            <p className="or">
              <span><hr /></span>
              <span>OR</span>
              <span><hr /></span>
            </p>

            <button type="button" className="google-button">
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        <div>
          <img src={signupImage} alt="Sign in visual" className="signup-image" />
        </div>
      </div>
    </>
  );
}

export default SignIn;
