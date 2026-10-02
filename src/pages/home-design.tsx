import React from 'react';
import TopNav from '../components/homedesign/TopNav';
import HeroSection from '../components/homedesign/HeroSection';
import ClanProfile from '../components/homedesign/ClanProfile';
import Footer from '../components/homedesign/Footer';

export default function HomeDesign() {
  return (
    <div className="relative min-h-screen w-full bg-[#1a120b] font-sans">
      {/* ------- bg-meta fullscreen backdrop (slightly darkened) ------- */}
      <div className="absolute inset-0 h-screen">
        <img
          src="/bg-meta.png"
          alt="Aura-7F village"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <TopNav />
      <HeroSection />
      <ClanProfile />
      <Footer />
    </div>
  );
}
