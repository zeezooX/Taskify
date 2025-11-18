import type { AuthResponse, LoginRequest, RegisterRequest } from '@/interfaces';
import { api } from '@/lib/axios';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
	const response = await api.post<AuthResponse>('/auth/login', data);
	return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
	const response = await api.post<AuthResponse>('/auth/register', data);
	return response.data;
};
