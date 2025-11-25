import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { DeleteTaskDialog, UpdateTaskDialog } from '@/components/dialogs';
import { MainLayout } from '@/components/layouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTask } from '@/hooks';

export const ViewTaskPage = () => {
	const { taskId } = useParams<{ taskId: string }>();
	const navigate = useNavigate();
	const { data: task, isLoading, isError } = useTask(Number(taskId));

	if (isLoading) {
		return (
			<MainLayout>
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-10" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-9 w-[200px]" />
							<Skeleton className="h-5 w-[300px]" />
						</div>
						<div className="flex gap-2">
							<Skeleton className="h-10 w-[100px]" />
							<Skeleton className="h-10 w-[100px]" />
						</div>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<Skeleton className="h-8 w-[300px]" />
									<Skeleton className="h-5 w-[100px]" />
								</div>
								<Skeleton className="h-6 w-[80px]" />
							</div>
						</CardHeader>
						<Separator />
						<CardContent className="space-y-4 pt-6">
							<div>
								<Skeleton className="mb-2 h-5 w-[100px]" />
								<Skeleton className="h-20 w-full" />
							</div>

							<Separator />

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Skeleton className="mb-2 h-5 w-[80px]" />
									<Skeleton className="h-6 w-[150px]" />
								</div>
								<div>
									<Skeleton className="mb-2 h-5 w-[80px]" />
									<Skeleton className="h-6 w-[100px]" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</MainLayout>
		);
	}

	if (isError || !task) {
		return (
			<MainLayout>
				<div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
					<div className="text-muted-foreground text-lg">Task not found</div>
					<Button onClick={() => navigate('/')}>Go Back Home</Button>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer"
						onClick={() => navigate('/')}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div className="flex-1">
						<h1 className="text-3xl font-bold">Task Details</h1>
						<p className="text-muted-foreground">View and manage task information</p>
					</div>
					<div className="flex gap-2">
						<UpdateTaskDialog
							task={task}
							trigger={
								<Button
									variant="outline"
									className="cursor-pointer">
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</Button>
							}
						/>
						<DeleteTaskDialog
							task={task}
							trigger={
								<Button
									variant="destructive"
									className="cursor-pointer hover:opacity-80">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</Button>
							}
						/>
					</div>
				</div>

				<Card>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="space-y-1">
								<CardTitle className="text-2xl">{task.title}</CardTitle>
								<CardDescription>Task ID: #{task.id}</CardDescription>
							</div>
							<Badge
								variant={task.isCompleted ? 'default' : 'secondary'}
								className="text-sm">
								{task.isCompleted ? 'Completed' : 'Pending'}
							</Badge>
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="space-y-4">
						<div>
							<h3 className="text-muted-foreground mb-2 text-sm font-medium">Description</h3>
							<p className="text-base">
								{task.description || (
									<span className="text-muted-foreground italic">No description provided</span>
								)}
							</p>
						</div>

						<Separator />

						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-muted-foreground mb-2 text-sm font-medium">Due Date</h3>
								<p className="text-base">
									{task.dueDate ? (
										format(new Date(task.dueDate), 'PPP')
									) : (
										<span className="text-muted-foreground italic">No due date set</span>
									)}
								</p>
							</div>

							<div>
								<h3 className="text-muted-foreground mb-2 text-sm font-medium">Status</h3>
								<p className="text-base">{task.isCompleted ? 'Completed' : 'Pending'}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</MainLayout>
	);
};
