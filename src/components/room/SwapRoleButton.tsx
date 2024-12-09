'use client';

import { useRouter } from 'next/navigation';


const SwapRoleButton = ({role}) => {
  const router = useRouter(); // Make sure it's inside a React component
  
  const handleClick = () => {
    const newRole = role === 'Interviewer' ? 'Interviewee' : 'Interviewer';
    const currentPath = window.location.pathname; 
    router.push(`${currentPath}?role=${newRole}`, undefined, { shallow: true });
  };

  return (
    <button onClick={handleClick}>
      Swap Role
    </button>
  );
};

export default SwapRoleButton;
