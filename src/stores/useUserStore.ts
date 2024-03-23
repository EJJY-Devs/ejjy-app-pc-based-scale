import { User } from 'ejjy-global';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
	user: User | null;
	setUser: (user: User) => void;
	resetUser: () => void;
}

export const useUserStore = create(
	persist<Store>(
		(set) => ({
			user: null,
			setUser: (user) => set(() => ({ user })),
			resetUser: () => set({ user: null }),
		}),
		{
			name: 'user',
			getStorage: () => localStorage,
		},
	),
);
