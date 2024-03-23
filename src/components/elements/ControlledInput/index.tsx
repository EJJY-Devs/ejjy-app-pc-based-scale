// eslint-disable jsx-a11y/no-autofocus
import * as React from 'react';
import { cn } from 'utils';

type Props = {
	id?: string;
	value: any;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	onChange: any;
	onFocus?: any;
	autoFocus?: boolean;
	className?: string;
	step?: string;
};

// eslint-disable-next-line react/display-name
export const ControlledInput = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			className,
			type = 'text',
			id,
			max,
			min,
			placeholder,
			onChange,
			onFocus,
			disabled,
			autoFocus,
			value,
			step,
		}: Props,
		ref,
	) => (
		<input
			ref={ref}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			className={cn(
				'block w-full rounded border border-solid border-gray px-3 py-2 text-base text-dark',
				className,
				{
					'bg-background': disabled,
				},
			)}
			disabled={disabled}
			id={id}
			max={max}
			min={min}
			name={id}
			placeholder={placeholder}
			step={step}
			type={type}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			onFocus={(event) => {
				if (onFocus) onFocus(event.target.value);
			}}
			onKeyDown={(evt) => {
				if (type === 'number' && ['e', 'E', '+', '-'].includes(evt.key)) {
					evt.preventDefault();
				}
			}}
		/>
	),
);
