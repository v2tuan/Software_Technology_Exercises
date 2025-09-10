export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
  meta?: Record<string, unknown>;
}

export interface CartContextType {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}