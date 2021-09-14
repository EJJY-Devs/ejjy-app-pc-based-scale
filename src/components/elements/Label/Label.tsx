import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	id?: string;
	label: string | React.ReactNode;
	spacing?: boolean;
	className?: string;
}

const Label = ({ id, label: inputLabel, spacing, className }: Props) => (
	<label
		htmlFor={id}
		className={cn('Label', className, { Label__withSpacing: spacing })}
	>
		{inputLabel}
	</label>
);

export default Label;
