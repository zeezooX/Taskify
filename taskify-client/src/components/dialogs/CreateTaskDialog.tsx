import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { useCreateTask } from '@/hooks';
import { cn } from '@/lib/utils';
import { type CreateTaskFormData, createTaskSchema } from '@/schemas';

interface CreateTaskDialogProps {
	trigger: ReactNode;
}

export const CreateTaskDialog = ({ trigger }: CreateTaskDialogProps) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { mutate: createTask, isPending } = useCreateTask();

	const form = useForm<CreateTaskFormData>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: '',
			description: '',
			dueDate: undefined
		}
	});

	const onSubmit = (data: CreateTaskFormData) => {
		createTask(
			{
				title: data.title,
				description: data.description,
				dueDate: data.dueDate?.toISOString()
			},
			{
				onSuccess: (newTask) => {
					form.reset();
					setOpen(false);
					navigate(`/tasks/${newTask.id}`);
				}
			}
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create Task</DialogTitle>
					<DialogDescription>Add a new task to your list.</DialogDescription>
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
										<Input
											placeholder="Enter task title"
											{...field}
										/>
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
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter task description"
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
									<FormLabel>Due Date (Optional)</FormLabel>
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
								{isPending ? 'Creating...' : 'Create Task'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
