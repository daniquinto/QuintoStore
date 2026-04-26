import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
      searchTerm: '',
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get('https://fakestoreapi.com/products');
          // Normalize data: ensure we have both 'name' (used in search) and 'title' (original)
          const normalizedProducts = response.data.map(p => ({
            ...p,
            name: p.title // Add name field for compatibility with our search logic
          }));
          set({ 
            products: normalizedProducts, 
            filteredProducts: normalizedProducts, 
            loading: false 
          });
        } catch (error) {
          set({ error: 'Error al cargar productos de la API', loading: false });
          console.error(error);
        }
      },

      setSearchTerm: (term) => set((state) => {
        const searchTerm = term.toLowerCase();
        const filteredProducts = state.products.filter(product => 
          (product.name || product.title).toLowerCase().includes(searchTerm) || 
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
