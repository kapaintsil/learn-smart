import React from 'react';
import './HeroCards.css';

import integrationIcon from '../assets/icons/integration.png';
import person from '../assets/icons/person.png';
import check from '../assets/icons/check.png';

function HeroCards() {
  return (
    <section className="hero-cards">
      <h2 className="hero-cards-header">
        Tired of juggling multiple tools? LearnSmart is the <br />place for you!
      </h2>

      <div className="cards-container">
        <div className="card">
          <img src={integrationIcon} alt="Integration Icon" className="card-icon" />
          <h3>Seamless Integration</h3>
          <p>Access essential learning tools, from writing assistants to transcribers all in one place.</p>
        </div>

        <div className="card">
          <img src={person} alt="Personalized Icon" className="card-icon" />
          <h3>Personalized Experience</h3>
          <p>Get tailored support based on your learning style and preferences, and learn at your own pace.</p>
        </div>

        <div className="card">
          <img src={check} alt="Focus Icon" className="card-icon" />
          <h3>Distraction Free</h3>
          <p>Focus on completing your task with no interruptions. LearnSmart has everything you need.</p>
        </div>
      </div>
    </section>
  );
}

export default HeroCards;
