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
	classNames?: any;
	ref?: any;
	step?: string;
}

const ControlledInput = React.forwardRef<HTMLInputElement, Props>(
	(
		{
			classNames,
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
			className={cn('Input', classNames)}
			placeholder={placeholder}
			max={max}
			min={min}
			disabled={disabled}
			onChange={(event) => onChange(event.target.value)}
			onFocus={(event) => {
				if (onFocus) onFocus(event.target.value);
			}}
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
