import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/store';

export const AuthGuard = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
};

export const GuestGuard = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
	return isAuthenticated ? (
		<Navigate
			to="/"
			replace
		/>
	) : (
		<Outlet />
	);
};
