import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import React from "react";


const LandingPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
