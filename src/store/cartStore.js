import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(item => item.product.id === product.id);
        
        // Ensure quantity is a valid number
        const qtyToAdd = Number(quantity) || 1;

        if (existing) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + qtyToAdd }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity: qtyToAdd }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.product.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map(item =>
            item.product.id === id ? { ...item, quantity: Number(quantity) || 1 } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => {
          const price = parseFloat(item.product.price) || 0;
          const quantity = Number(item.quantity) || 0;
          return sum + (price * quantity);
        }, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
