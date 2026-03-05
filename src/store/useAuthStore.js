import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('wagashi_token') || null,
  isLoading: false,

  setToken: (token) => {
    localStorage.setItem('wagashi_token', token);
    set({ token });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isLoading: false });
    } catch {
      localStorage.removeItem('wagashi_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('wagashi_token');
    set({ user: null, token: null });
  },

  isLoggedIn: () => !!get().token,
}));

export default useAuthStore;
