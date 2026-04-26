import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      login: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => {
        set({ user: null, isLoggedIn: false });
        // Also clear any other session-related data if needed
      },
      updateUser: (newData) => set((state) => ({ 
        user: { ...state.user, ...newData } 
      })),
    }),
    {
      name: 'user-session',
    }
  )
);

export default useUserStore;
