import { cn } from 'utils';
import * as React from 'react';

type Props = {
	id?: string;
	label: string | React.ReactNode;
	spacing?: boolean;
	className?: string;
};

export const Label = ({ id, label: inputLabel, spacing, className }: Props) => (
	<label
		className={cn('block text-sm font-bold text-darkGray', className, {
			'mb-1': spacing,
		})}
		htmlFor={id}
	>
		{inputLabel}
	</label>
);
