import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { login, register } from '@/queries';
import { useAuthStore } from '@/store';

export const useLogin = () => {
	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			useAuthStore.getState().setAuth({ email: data.email, userId: data.userId }, data.token);
			toast.success('Login successful!');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || error?.message || 'Login failed';
			toast.error(message);
		}
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			useAuthStore.getState().setAuth({ email: data.email, userId: data.userId }, data.token);
			toast.success('Registration successful!');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || error?.message || 'Registration failed';
			toast.error(message);
		}
	});
};

export const useLogout = () => {
	const clearUser = useAuthStore((state) => state.clearUser);
	return () => {
		clearUser();
	};
};

export const useUser = () => {
	return useAuthStore((state) => state.user);
};
