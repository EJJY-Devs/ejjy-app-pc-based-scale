import cn from 'classnames';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	classNames?: string;
	onChange?: any;
	value?: any;
}

const Input = ({
	type,
	id,
	max,
	min,
	placeholder,
	disabled,
	classNames,
	onChange,
	value,
}: IInputProps) => (
	<input
		type={type}
		id={id}
		name={id}
		className={cn('Input', classNames)}
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
		value={value}
		onChange={onChange}
	/>
);

Input.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default Input;
