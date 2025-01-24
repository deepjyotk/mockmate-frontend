'use client';

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@/redux/hooks";
import { resetLoginState } from "@/redux/slices/auth/loginSlice";

interface NavbarProps {
  username: string;
  userProfileUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ username, userProfileUrl }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const dispatch = useAppDispatch();
  


  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const handleLogout = async () => {
    try {
      router.replace('/auth/logout');
      dispatch(resetLoginState()); // <-- resets status to "idle" and clears fields

    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <motion.nav
      className="bg-white shadow-md fixed w-full z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {/* Replace '/path-to-logo.png' with your actual logo path */}
              <Image
                src="/logo.png"
                alt="MockMate Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-2xl font-bold text-primary">MockMate</span>
            </Link>
          </div>

          {/* Navigation Links
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary transition duration-300">
              Home
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-primary transition duration-300">
              Courses
            </Link>
            <Link href="/questions" className="text-gray-700 hover:text-primary transition duration-300">
              Questions
            </Link>
            <Link href="/peer-mocks" className="text-gray-700 hover:text-primary transition duration-300">
              Peer Mocks
            </Link>
          </div> */}

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary focus:outline-none transition duration-300"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {userProfileUrl ? (
                <Image
                  src={userProfileUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold">
                  {getInitial(username)}
                </div>
              )}
              <span className="hidden sm:block">{username}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;