import { LoaderCircle, Moon, Sun } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLogout, useTheme, useUser } from '@/hooks';
import { onMessageListener, syncFcmToken } from '@/lib/firebase';

interface MainLayoutProps {
	children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const user = useUser();
	const { mutate: logout, isPending } = useLogout();
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();

	const handleLogout = () => {
		logout();
	};

	const getUserInitials = () => {
		if (!user?.email) return 'U';
		return user.email.charAt(0).toUpperCase();
	};

	useEffect(() => {
		syncFcmToken();

		onMessageListener().then((payload: any) => {
			toast.info(payload.notification?.title || 'New Notification', {
				description: payload.notification?.body || '',
				action: {
					label: 'View',
					onClick: () => {
						navigate(payload?.data?.click_action || '/');
					}
				}
			});
		});
	}, [navigate]);

	return (
		<div className="bg-background min-h-screen">
			{/* Navigation Bar */}
			<nav className="bg-card border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<button
						className="flex cursor-pointer items-center gap-2 hover:opacity-80"
						onClick={() => navigate('/')}>
						<h1 className="text-xl font-bold">Taskify</h1>
					</button>

					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							size="icon"
							onClick={toggleTheme}
							aria-label="Toggle theme">
							{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
						</Button>
						{user && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full">
										<Avatar>
											{isPending ? (
												<div className="flex h-full w-full items-center justify-center">
													<LoaderCircle
														className="h-full w-full animate-spin"
														aria-hidden
													/>
												</div>
											) : (
												<AvatarFallback className="flex h-full w-full items-center justify-center">
													{getUserInitials()}
												</AvatarFallback>
											)}
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm leading-none font-medium">My Account</p>
											<p className="text-muted-foreground text-xs leading-none">{user.email}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										className="cursor-pointer">
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="container mx-auto p-4">{children}</main>
		</div>
	);
};
