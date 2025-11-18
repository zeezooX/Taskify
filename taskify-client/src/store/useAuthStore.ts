import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthState, User } from '@/interfaces';

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,

			setAuth: (user: User, token: string) => {
				set({ user, token });
			},

			setToken: (token: string) => {
				set({ token });
			},

			clearUser: () => {
				set({ user: null, token: null });
			},

			isAuthenticated: () => {
				return get().token !== null;
			}
		}),
		{
			name: 'taskify-auth',
			storage: createJSONStorage(() => localStorage)
		}
	)
);
