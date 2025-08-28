import React from 'react';

// FIX: Update CardProps to extend React.HTMLAttributes and forward props to the underlying div. This allows passing standard attributes like `style` to the Card component, fixing a type error.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6', ...props }) => {
  return (
    <div className={`card-base ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
