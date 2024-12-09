// src/pages/auth/login.tsx
import React from 'react';
import SignupForm from '@/components/auth/signup/SignupForm';

const SignupPage: React.FC = async () => {
  return (
    
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <SignupForm />
      </div>
  );
};

export default SignupPage;
