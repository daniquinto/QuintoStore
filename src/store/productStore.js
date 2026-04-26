import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
      searchTerm: '',
      selectedCategory: '',
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get('https://fakestoreapi.com/products');
          const normalizedProducts = response.data.map(p => ({
            ...p,
            name: p.title 
          }));
          set({ 
            products: normalizedProducts, 
            loading: false 
          });
          get().applyFilters(); // Apply filters once products are fetched
        } catch (error) {
          set({ error: 'Error al cargar productos de la API', loading: false });
          console.error(error);
        }
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
        get().applyFilters();
      },

      applyFilters: () => {
        const { products, searchTerm, selectedCategory } = get();
        let filtered = [...products];

        if (selectedCategory) {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(product => 
            (product.name || product.title).toLowerCase().includes(lowerTerm) || 
            product.description.toLowerCase().includes(lowerTerm)
          );
        }

        set({ filteredProducts: filtered });
      },

      resetFilters: () => {
        const { products } = get();
        set({
          searchTerm: '',
          selectedCategory: '',
          filteredProducts: products
        });
      }
    }),
    {
      name: 'product-storage',
    }
  )
);

export default useProductStore;
