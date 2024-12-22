"use client";

import React from "react";
import { Language } from "./CollaborabativeEditor";

// Define the props interface, including the languages prop
interface ToolbarProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  onRunCode: () => Promise<void>;
  onRequestReset: () => void;
  languages: Language[]; // Added languages prop
}

export function Toolbar({
  language,
  setLanguage,
  onRunCode,
  onRequestReset,
  languages, // Destructure languages from props
}: ToolbarProps) {
  return (
    <div className="flex items-center p-4 bg-gray-800 text-white">
      {/* Language Selector */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mr-4 p-2 bg-gray-700 border border-gray-600 rounded"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.value}>
            {lang.name}
          </option>
        ))}
      </select>

      {/* Run Code Button */}
      <button
        onClick={onRunCode}
        className="mr-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        Run
      </button>

      {/* Reset Button */}
      <button
        onClick={onRequestReset}
        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  );
}
