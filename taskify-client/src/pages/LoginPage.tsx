import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks';
import { type LoginFormData, loginSchema } from '@/schemas';

export const LoginPage = () => {
	const { mutate: login, isPending, isSuccess } = useLogin();
	const navigate = useNavigate();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	useEffect(() => {
		if (isSuccess) {
			navigate('/');
		}
	}, [isSuccess, navigate]);

	const onSubmit = (data: LoginFormData) => {
		login(data);
	};

	return (
		<AuthLayout
			title="Login"
			description="Welcome back! Please login to your account.">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Enter your password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full cursor-pointer hover:opacity-80"
						disabled={isPending}>
						{isPending ? 'Logging in...' : 'Login'}
					</Button>

					<p className="text-muted-foreground text-center text-sm">
						Don't have an account?{' '}
						<Link
							to="/register"
							className="text-primary font-medium hover:underline">
							Register
						</Link>
					</p>
				</form>
			</Form>
		</AuthLayout>
	);
};
