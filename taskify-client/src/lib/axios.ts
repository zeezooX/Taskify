import axios from 'axios';

import { useAuthStore } from '../store';

const BASE_URL = '/api';

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshResponse = await axios.post(
					`${BASE_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				);

				const newToken = refreshResponse.data.token;
				useAuthStore.getState().setToken(newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				return api(originalRequest);
			} catch (refreshError) {
				useAuthStore.getState().clearUser();
				globalThis.location.href = '/login';
				throw refreshError;
			}
		}

		throw error;
	}
);
