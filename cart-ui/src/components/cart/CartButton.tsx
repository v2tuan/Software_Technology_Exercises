import React from 'react';
import { Button } from '../ui_v1';
import { useCart } from '../../hooks';

interface CartButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CartButton: React.FC<CartButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showCount = true,
  className = '',
  children
}) => {
  const { count, toggleCart } = useCart();
  const cartCount = count();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleCart}
      className={`relative ${className}`}
    >
      {children || (
        <>
          <svg 
            className="h-5 w-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5H19" 
            />
          </svg>
          {showCount && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md border border-background">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
};