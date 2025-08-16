import React, { useState, useEffect } from 'react';
import './Hero.css';
import heroImage from '../assets/images/hero-image.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase';

function Hero() {
  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const headline = [
    { text: 'a centralized', className: 'span-1' },
    { text: 'ai - powered', className: 'span-2' },
    { text: 'platform for', className: 'span-1' },
    { text: 'smarter learning', className: 'span-2' }
  ];

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (userLoggedIn) {
      navigate('/aitools');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-heading">
          {headline.map((part, index) => (
            <span key={index} className={part.className}>
              {part.text}{' '}
            </span>
          ))}
        </h1>
        <p className="hero-subtext">
          Learning just got easier! Elevate your academic journey with LearnSmart! 
          Find your flashcard generator, quiz generator, 
          and other AI tools for you in one location.
        </p>
        <button className="hero-button" onClick={handleGetStarted}>
          {userLoggedIn ? 'Go to Tools' : 'Get Started'}
        </button>
      </div>

      <div className="hero-right">
        <img src={heroImage} alt="Learning illustration" className="hero-image" />
      </div>
    </section>
  );
}

export default Hero;
