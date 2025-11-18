import React, { useState } from 'react';
import type { ReactNode } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface DialogLayoutProps {
	trigger: ReactNode;
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const DialogLayout: React.FC<DialogLayoutProps> = ({
	trigger,
	children,
	open: controlledOpen,
	onOpenChange
}) => {
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? onOpenChange! : setInternalOpen;

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">{children}</DialogContent>
		</Dialog>
	);
};
