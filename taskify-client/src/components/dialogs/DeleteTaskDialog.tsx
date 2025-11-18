import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useDeleteTask } from '@/hooks';
import type { Task } from '@/interfaces';

interface DeleteTaskDialogProps {
	trigger: ReactNode;
	task: Task;
}

export const DeleteTaskDialog = ({ trigger, task }: DeleteTaskDialogProps) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { mutate: deleteTask, isPending } = useDeleteTask();

	const handleDelete = () => {
		deleteTask(task.id, {
			onSuccess: () => {
				setOpen(false);
				navigate('/');
			}
		});
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Task</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete "{task.title}"? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isPending}
						className="cursor-pointer">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/80 cursor-pointer">
						{isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
