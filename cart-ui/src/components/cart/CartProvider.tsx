import React, { createContext, useEffect, useReducer, useState } from 'react';
import type { CartItem, CartContextType } from '../../types';

type State = { 
  items: CartItem[];
};

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD_FROM_STORAGE'; items: CartItem[] };

const initialState: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id);
      if (exists) {
        return {
          items: state.items.map(i => 
            i.id === action.item.id 
              ? { ...i, qty: i.qty + action.item.qty } 
              : i
          )
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return { items: state.items.filter(i => i.id !== action.id) };
      }
      return { 
        items: state.items.map(i => 
          i.id === action.id ? { ...i, qty: action.qty } : i
        ) 
      };
    case 'CLEAR':
      return { items: [] };
    case 'LOAD_FROM_STORAGE':
      return { items: action.items };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
  persistCart?: boolean;
  storageKey?: string;
}

export const CartProvider: React.FC<CartProviderProps> = ({ 
  children,
  persistCart = true,
  storageKey = 'cart'
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!persistCart) return;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const items = JSON.parse(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', items });
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
    }
  }, [persistCart, storageKey]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!persistCart) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [state, persistCart, storageKey]);

  const api: CartContextType = {
    items: state.items,
    add: (item: CartItem) => dispatch({ type: 'ADD', item }),
    remove: (id: string) => dispatch({ type: 'REMOVE', id }),
    updateQty: (id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
    total: () => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    count: () => state.items.reduce((sum, item) => sum + item.qty, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen(prev => !prev)
  };

  return (
    <CartContext.Provider value={api}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };