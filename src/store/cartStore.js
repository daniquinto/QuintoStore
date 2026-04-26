import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        const items = get().items;
        const existing = items.find(item => item.product.id === product.id);
        
        if (existing) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.product.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map(item =>
            item.product.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0),
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useCartStore;
