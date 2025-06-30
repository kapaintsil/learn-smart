import React from 'react';
import './SignUp.css';import NavBar from '../../Components/NavBar';
import signupImage from '../../assets/images/learner.png';

function SignUp() {
  return (
    <>
      <NavBar />
      <div className="signup-container">
        <div className="signup-box">
          <h2>Welcome Back</h2>
          <form className="signup-form">
            <input type="email" placeholder="Email/Phone" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="signup-button">Continue</button>
            <p className="signup-login-text">
            Don't have an account? <a href="/login">Sign up</a>
          </p>
          <p>OR</p>
          <button type="submit" className="google-button">Continue with google</button>
          </form>
          
        </div>
        <div>
          <img src={signupImage} alt="SignUp form Image" className="signup-image"/>
        </div>
      </div>
    </>
  );
}

export default SignUp;
