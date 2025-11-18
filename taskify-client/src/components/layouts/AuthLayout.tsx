import { Moon, Sun } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks';

interface AuthLayoutProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, description, children }) => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="bg-background relative flex min-h-screen items-center justify-center p-4">
			<Button
				variant="outline"
				size="icon"
				onClick={toggleTheme}
				aria-label="Toggle theme"
				className="absolute top-4 right-4">
				{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
			</Button>
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<Separator />
				<CardContent>{children}</CardContent>
			</Card>
		</div>
	);
};
