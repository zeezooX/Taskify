export interface User {
	email: string;
	userId: number;
}

export interface AuthState {
	user: User | null;
	token: string | null;

	setAuth: (user: User, token: string) => void;
	setToken: (token: string) => void;
	clearUser: () => void;

	isAuthenticated: () => boolean;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthResponse {
	email: string;
	userId: number;
	token: string;
}
