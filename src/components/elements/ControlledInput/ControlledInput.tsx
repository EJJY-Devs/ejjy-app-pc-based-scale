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

// eslint-disable-next-line react/display-name
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
			// eslint-disable-next-line jsx-a11y/no-autofocus
			autoFocus={autoFocus}
			className={cn('Input', className)}
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

ControlledInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default ControlledInput;
