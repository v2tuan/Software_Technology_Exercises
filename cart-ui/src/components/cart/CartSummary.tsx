import React from 'react';
import { Button, Card } from '../ui_v1';
import { useCart } from '../../hooks';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  checkoutText?: string;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  onCheckout,
  checkoutText = 'Checkout',
  className = ''
}) => {
  const { items, total, count, clear } = useCart();

  const subtotal = total();
  const tax = subtotal * 0.1; // 10% tax
  const finalTotal = subtotal + tax;

  return (
    <Card className={className}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items ({count()})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {showCheckoutButton && (
            <Button
              variant="primary"
              className="w-full"
              onClick={onCheckout}
              disabled={items.length === 0}
            >
              {checkoutText}
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={clear}
            disabled={items.length === 0}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};