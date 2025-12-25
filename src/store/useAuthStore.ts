import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  creditBalance: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
    }
    
    const data = await res.json();
    set({ user: data.user });
  },

  register: async (email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Register failed');
    }
    
    const data = await res.json();
    set({ user: data.user });
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
