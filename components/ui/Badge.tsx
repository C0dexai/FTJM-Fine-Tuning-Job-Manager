
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
