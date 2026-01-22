import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,

    register: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/auth/register', data);
            localStorage.setItem('user', JSON.stringify(res.data));
            set({ user: res.data, loading: false });
        } catch (err) {
            set({ error: err, loading: false });
            throw err;
        }
    },

    login: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/auth/login', data);
            localStorage.setItem('user', JSON.stringify(res.data));
            set({ user: res.data, loading: false });
        } catch (err) {
            set({ error: err, loading: false });
            throw err;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('user');
            set({ user: null });
        } catch (err) {
            console.error('Logout error:', err);
        }
    },

    getProfile: async () => {
        try {
            const res = await api.get('/auth/profile');
            set({ user: res.data });
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            localStorage.removeItem('user');
            set({ user: null });
        }
    },

    updateUser: (userData) => {
        set((state) => {
            const newUser = { ...state.user, ...userData };
            localStorage.setItem('user', JSON.stringify(newUser));
            return { user: newUser };
        });
    }
}));

export default useAuthStore;
