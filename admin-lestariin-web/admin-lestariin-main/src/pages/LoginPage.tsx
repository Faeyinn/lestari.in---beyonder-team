import React from 'react';
import { LoginCard } from '@/components/login/LoginCard';

const LoginPage: React.FC = () => {

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-lime-300 via-green-400 to-teal-700 p-4">
      <LoginCard />
    </div>
  );
};

export default LoginPage;