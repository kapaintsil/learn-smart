import React from 'react';
import NavBar from '../../Components/NavBar';
import Hero from '../../Components/Hero';
import HeroCards from '../../Components/HeroCards';
import Footer from '../../Components/Footer';

function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <HeroCards />
      <Footer />
    </>
  );
}

export default Home;