import React from 'react';
import { Button, Input } from '../ui_v1';
import { useCart } from '../../hooks';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  showImage?: boolean;
  showQuantityControls?: boolean;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  showImage = true,
  showQuantityControls = true,
  className = ''
}) => {
  const { updateQty, remove } = useCart();

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value) || 0;
    updateQty(item.id, qty);
  };

  const incrementQuantity = () => {
    updateQty(item.id, item.qty + 1);
  };

  const decrementQuantity = () => {
    if (item.qty > 1) {
      updateQty(item.id, item.qty - 1);
    }
  };

  return (
    <div className={`flex items-center space-x-4 py-4 ${className}`}>
      {showImage && item.image && (
        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)}
        </p>
      </div>

      {showQuantityControls && (
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={decrementQuantity}
            className="h-8 w-8 p-0 hover:bg-muted"
            disabled={item.qty <= 1}
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </Button>
          
          <Input
            type="number"
            value={item.qty}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-16 text-center h-8 text-sm"
            min="0"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={incrementQuantity}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      )}

      <div className="text-sm font-medium tabular-nums">
        ${(item.price * item.qty).toFixed(2)}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => remove(item.id)}
        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
  );
};