import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseClasses = "w-full py-3 rounded-xl font-semibold transition-all duration-300";
  const variants = {
    primary: "bg-teal-700 hover:bg-teal-800 text-white shadow-lg hover:shadow-xl",
    outline: "bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};