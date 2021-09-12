import cn from 'classnames';
import { Field } from 'formik';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	className?: string;
	autoFocus?: boolean;
	inputRef?: any;
	step?: string;
}

const FormInput = ({
	type,
	id,
	max,
	min,
	placeholder,
	disabled,
	autoFocus,
	className,
	inputRef,
	step,
}: IInputProps) => (
	<Field
		innerRef={inputRef}
		type={type}
		id={id}
		name={id}
		className={cn('FormInput', className)}
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
		// eslint-disable-next-line jsx-a11y/tabindex-no-positive
		tabIndex={1}
		autoFocus={autoFocus}
		step={step}
	/>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default FormInput;
