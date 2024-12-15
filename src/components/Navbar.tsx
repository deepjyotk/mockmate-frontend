'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use useRouter from 'next/navigation'

interface NavbarProps{
  username: string ;
  userProfileUrl: string;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter(); // For redirecting to the login page
  
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      // await fetch('/api/logout', { 
      //   method: 'POST' 
      // });
      
      // Redirect to login page
      router.replace('/auth/logout');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">MockMate</h1>
        <ul className="flex space-x-4">
          {/* Uncomment the links below if needed */}
          {/* <Link href="/" className="text-foreground hover:text-primary">Courses</Link>
          <Link href="/" className="text-foreground hover:text-primary">Questions</Link>
          <Link href="/" className="text-foreground hover:text-primary">Peer Mocks</Link> */}
        </ul>
        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-foreground hover:text-primary"
          >
            {props.userProfileUrl ? (
              <Image
                src={props.userProfileUrl} 
                alt="Profile"
                width={32} 
                height={32} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold">
                {getInitial(props.username)}
              </div>
            )}
            <span className="hidden sm:block">{props.username}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
              <Link
                href="/profile"
                className="block px-4 py-2 text-foreground hover:bg-gray-100"
              >
                Profile
              </Link>
              {/* <Link
                href="/settings"
                className="block px-4 py-2 text-foreground hover:bg-gray-100"
              >
                Settings
              </Link> */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;