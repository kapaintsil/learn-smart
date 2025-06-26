import React from 'react';
import './Hero.css';
import heroImage from '../assets/images/hero-image.png';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-heading"><span className="span-1">a centralized</span> <span className="span-2">ai - powered</span> <span className="span-1">platform for</span> <span className="span-2">smarter learning</span></h1>
        <p className="hero-subtext">Learning just got easier! Elevate your academic journey with LearnSmart! Find your research assistant, code helper, text-to-speech transcribers, and other AI tools for you in one location.</p>
        <button className="hero-button">Get Started</button>
      </div>
      <div className="hero-right">
        <img src={heroImage} alt="Learning illustration" className="hero-image" />
      </div>
    </section>
  );
}

export default Hero;
