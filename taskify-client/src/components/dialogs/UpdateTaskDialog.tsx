import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateTask } from '@/hooks';
import type { Task } from '@/interfaces';
import { cn } from '@/lib/utils';
import { type UpdateTaskFormData, updateTaskSchema } from '@/schemas';

interface UpdateTaskDialogProps {
	trigger: ReactNode;
	task: Task;
}

export const UpdateTaskDialog = ({ trigger, task }: UpdateTaskDialogProps) => {
	const [open, setOpen] = useState(false);
	const [completed, setCompleted] = useState(false);
	const { mutate: updateTask, isPending } = useUpdateTask();
	const form = useForm<UpdateTaskFormData>({
		resolver: zodResolver(updateTaskSchema),
		defaultValues: { title: '', description: '', dueDate: undefined }
	});

	useEffect(() => {
		if (open) {
			form.reset({
				title: task.title,
				description: task.description || '',
				dueDate: task.dueDate ? new Date(task.dueDate) : undefined
			});
			setTimeout(() => setCompleted(task.isCompleted), 0);
		}
	}, [open, task, form]);

	const onSubmit = (data: UpdateTaskFormData) => {
		updateTask(
			{
				id: task.id,
				taskData: {
					title: data.title,
					description: data.description,
					dueDate: data.dueDate?.toISOString(),
					isCompleted: completed
				}
			},
			{ onSuccess: () => setOpen(false) }
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Update Task</DialogTitle>
					<DialogDescription>Make changes to your task.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Due Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn(
														'w-full pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground'
													)}>
													{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date < new Date()}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="completed"
								checked={completed}
								onCheckedChange={(checked) => setCompleted(checked === true)}
							/>
							<label
								htmlFor="completed"
								className="text-sm font-medium">
								Mark as completed
							</label>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								className="cursor-pointer"
								onClick={() => setOpen(false)}
								disabled={isPending}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="cursor-pointer"
								disabled={isPending}>
								{isPending ? 'Updating...' : 'Update Task'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
