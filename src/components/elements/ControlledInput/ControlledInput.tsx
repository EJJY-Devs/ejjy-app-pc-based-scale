import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
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
	className?: any;
	step?: string;
}

const ControlledInput = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			className,
			type,
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
			type={type}
			id={id}
			name={id}
			className={cn('Input', className)}
			placeholder={placeholder}
			max={max}
			min={min}
			disabled={disabled}
			onChange={(event) => onChange(event.target.value)}
			onFocus={(event) => {
				if (onFocus) onFocus(event.target.value);
			}}
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			value={value}
			step={step}
			onKeyDown={(evt) => {
				if (type === 'number' && ['e', 'E', '+', '-'].includes(evt.key)) {
					evt.preventDefault();
				}
			}}
		/>
	),
);

ControlledInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default ControlledInput;
