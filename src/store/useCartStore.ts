import { toast } from 'sonner';
import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  
  addToCart: (product: Product) => {
    if (product.quantity_in_stock <= 0) {
      toast.error("Product out of stock!");
      return;
    }
    
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.cartQty >= product.quantity_in_stock) {
           toast.error("Maximum stock level reached!");
           return state;
        }
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, cartQty: item.cartQty + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, cartQty: 1 }] };
    });
  },

  updateCartQty: (id: string, delta: number) => {
    set((state) => {
      return {
        cart: state.cart.map((item) => {
          if (item.id === id) {
            const newQty = item.cartQty + delta;
            if (newQty <= 0) return item; // UI shouldn't allow this, usually handled by checking delta or remove button
            if (newQty > item.quantity_in_stock) {
                toast.error("Cannot exceed available stock!");
                return item;
            }
            return { ...item, cartQty: newQty };
          }
          return item;
        }),
      };
    });
  },

  removeCartItem: (id: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },
}));
