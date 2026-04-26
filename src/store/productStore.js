import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set) => ({
      products: [],
      filteredProducts: [],
      searchTerm: '',

      setProducts: (products) => set({ 
        products, 
        filteredProducts: products 
      }),

      setSearchTerm: (term) => set((state) => {
        const searchTerm = term.toLowerCase();
        const filteredProducts = state.products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm)
        );
        return { searchTerm: term, filteredProducts };
      }),

      resetFilters: () => set((state) => ({
        searchTerm: '',
        filteredProducts: state.products
      }))
    }),
    {
      name: 'product-storage',
    }
  )
);

export default useProductStore;
