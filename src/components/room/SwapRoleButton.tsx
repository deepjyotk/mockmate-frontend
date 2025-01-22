'use client';

import { useRouter } from 'next/navigation';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SwapRoleButton = ({role}:any) => {
  const router = useRouter(); // Make sure it's inside a React component
  
  const handleClick = () => {
    const newRole = role === 'Interviewer' ? 'Interviewee' : 'Interviewer';
    const currentPath = window.location.pathname; 
    //removed shallow:True
    router.push(`${currentPath}?role=${newRole}`, undefined);
  };

  return (
    <button onClick={handleClick}>
      Swap Role
    </button>
  );
};

export default SwapRoleButton;
