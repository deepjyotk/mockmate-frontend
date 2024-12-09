"use client";

import React from "react";

const features = [
  {
    title: "AI-Generated Labels",
    description:
      "Automatically tag your images with AI-generated labels for easy search and organization.",
  },
  {
    title: "Custom Tagging",
    description: "Add your own custom labels to personalize your image data.",
  },
  {
    title: "Effortless Search",
    description:
      "Search your image library instantly with advanced keyword matching.",
  },
  {
    title: "Secure Storage",
    description: "Store your images securely in AWS S3 with full data integrity.",
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-20 bg-[var(--background)] text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white text-[var(--foreground)] rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-[var(--secondary)]">
              {feature.title}
            </h3>
            <p className="mt-2 text-[var(--muted)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
