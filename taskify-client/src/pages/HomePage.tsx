import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateTaskDialog } from '@/components/dialogs';
import { MainLayout } from '@/components/layouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useTasks, useUser } from '@/hooks';

export const HomePage = () => {
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize] = useState(10);
	const [isCompleted, setIsCompleted] = useState<boolean | undefined>(undefined);
	const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate');
	const [isDescending, setIsDescending] = useState(false);

	const user = useUser();
	const navigate = useNavigate();

	const { data, isLoading } = useTasks({
		pageNumber,
		pageSize,
		isCompleted,
		sortBy,
		isDescending
	});

	if (!user) {
		navigate('/login');
		return null;
	}

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">My Tasks</h1>
						<p className="text-muted-foreground">Manage your tasks efficiently</p>
					</div>
					<CreateTaskDialog
						trigger={
							<Button className="cursor-pointer">
								<Plus className="mr-2 h-4 w-4" />
								Create Task
							</Button>
						}
					/>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Filters</CardTitle>
						<CardDescription>Filter and sort your tasks</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-4">
						<div className="min-w-[200px] flex-1">
							<label className="mb-2 block text-sm font-medium">Status</label>
							<Select
								value={isCompleted === undefined ? 'all' : isCompleted ? 'completed' : 'pending'}
								onValueChange={(value) =>
									setIsCompleted(value === 'all' ? undefined : value === 'completed')
								}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Tasks</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="min-w-[200px] flex-1">
							<label className="mb-2 block text-sm font-medium">Sort By</label>
							<Select
								value={sortBy}
								onValueChange={(value: 'dueDate' | 'title') => setSortBy(value)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="dueDate">Due Date</SelectItem>
									<SelectItem value="title">Title</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="min-w-[200px] flex-1">
							<label className="mb-2 block text-sm font-medium">Order</label>
							<Select
								value={isDescending ? 'desc' : 'asc'}
								onValueChange={(value) => setIsDescending(value === 'desc')}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="asc">Ascending</SelectItem>
									<SelectItem value="desc">Descending</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Tasks</CardTitle>
						<CardDescription>{data?.metadata.TotalCount || 0} total tasks</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-4">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Due Date</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{Array.from({ length: 5 }).map((_, i) => (
											<TableRow key={i}>
												<TableCell>
													<Skeleton className="h-5 w-[200px]" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-5 w-[150px]" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-5 w-[80px]" />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : data?.items.length === 0 ? (
							<div className="text-muted-foreground py-8 text-center">
								No tasks found. Create one to get started!
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Due Date</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{data?.items.map((task) => (
											<TableRow
												key={task.id}
												className="hover:bg-muted/50 h-12 cursor-pointer"
												tabIndex={0}
												onClick={() => navigate(`/tasks/${task.id}`)}>
												<TableCell className="font-medium">{task.title}</TableCell>
												<TableCell>{task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'N/A'}</TableCell>
												<TableCell>
													<Badge variant={task.completed ? 'default' : 'secondary'}>
														{task.completed ? 'Completed' : 'Pending'}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								{data && data.metadata.TotalPages > 1 && (
									<div className="mt-4 flex items-center justify-between">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPageNumber((p) => p - 1)}
											disabled={!data.metadata.HasPrevious}>
											Previous
										</Button>
										<span className="text-muted-foreground text-sm">
											Page {data.metadata.CurrentPage} of {data.metadata.TotalPages}
										</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPageNumber((p) => p + 1)}
											disabled={!data.metadata.HasNext}>
											Next
										</Button>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};
