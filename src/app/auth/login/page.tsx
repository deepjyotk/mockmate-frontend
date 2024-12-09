// src/pages/auth/login.tsx

import LoginForm from '@/components/auth/login/LoginForm';
import React from 'react';
// import { redirect } from 'next/navigation'; // Next.js redirect for server components

// Server-side function to check if the user is authenticated
// async function checkAuthStatus() {
//   const session = await getSession(); // Assuming you have a getSession function
//   return session?.isAuthenticated;
// }

const LoginPage: React.FC = async () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
