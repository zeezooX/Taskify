import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { router } from '@/router';

const queryClient = new QueryClient();

function App() {
	useEffect(() => {
		const theme = localStorage.getItem('theme') || 'light';
		document.documentElement.classList.add(theme);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster />
		</QueryClientProvider>
	);
}

export default App;
