import React from 'react';
import { useCart } from '../../hooks';
import { Button } from '../ui_v1';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

interface CartDrawerProps {
  position?: 'left' | 'right';
  showOverlay?: boolean;
  onCheckout?: () => void;
  checkoutText?: string;
  emptyCartMessage?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  position = 'right',
  showOverlay = true,
  onCheckout,
  checkoutText = 'Proceed to Checkout',
  emptyCartMessage = 'Your cart is empty'
}) => {
  const { isOpen, closeCart, items } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}
      
      <div
        className={`
          fixed top-0 ${position}-0 h-full w-96 bg-background border-l shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Shopping Cart ({items.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={closeCart}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="h-8 w-8 text-muted-foreground" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5H19" 
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">{emptyCartMessage}</p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    className="border-b border-border pb-4 last:border-b-0"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <CartSummary
                onCheckout={onCheckout}
                checkoutText={checkoutText}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};