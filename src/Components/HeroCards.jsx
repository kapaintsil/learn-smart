import React from 'react';
import './HeroCards.css';
import heroCardFeatures from '../data/heroCardFeatures';

function HeroCards() {
  return (
    <section className="hero-cards">
      <h2 className="hero-cards-header">
        Tired of juggling multiple tools? LearnSmart is the <br />place for you!
      </h2>

      <div className="cards-container">
        {heroCardFeatures.map((feature, index) => (
          <div className="card" key={index}>
            <div className="icon-wrapper">
              <img
                src={feature.logo}
                alt={`${feature.title} Icon`}
                className="card-icon"
              />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeroCards;
