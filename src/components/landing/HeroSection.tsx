"use client";

import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-[var(--primary)] text-white text-center py-20 px-4 md:px-10">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
        Welcome to{" "}
        <span className="text-[var(--secondary)]">Image Inquiry</span>
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto">
        Revolutionize how you search and organize images with AI-powered
        automation and secure storage.
      </p>
      <div className="mt-8">
        <a
          href="/login"
          className="bg-[var(--secondary)] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[var(--danger)] transition-transform transform hover:scale-105 shadow-md"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
