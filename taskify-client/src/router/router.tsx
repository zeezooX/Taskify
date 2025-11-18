import { Navigate, createBrowserRouter } from 'react-router-dom';

import { HomePage, LoginPage, RegisterPage, ViewTaskPage } from '@/pages';

import { AuthGuard, GuestGuard } from './guards';

export const router = createBrowserRouter([
	{
		element: <AuthGuard />,
		children: [
			{
				path: '/',
				element: <HomePage />
			},
			{
				path: '/tasks/:taskId',
				element: <ViewTaskPage />
			}
		]
	},
	{
		element: <GuestGuard />,
		children: [
			{
				path: '/login',
				element: <LoginPage />
			},
			{
				path: '/register',
				element: <RegisterPage />
			}
		]
	},
	{
		path: '*',
		element: (
			<Navigate
				to="/login"
				replace
			/>
		)
	}
]);
