import * as React from 'react';
import FormInput, { IInputProps } from '../FormInput/FormInput';
import Label from '../Label/Label';

interface Props extends IInputProps {
	label: string;
	labelClassname?: string;
	inputClassname?: string;
}

const FormInputLabel = ({
	id,
	labelClassname,
	label: inputLabel,
	inputClassname,
	type,
	max,
	min,
	placeholder,
	disabled,
	inputRef,
}: Props) => (
	<>
		<Label className={labelClassname} id={id} label={inputLabel} spacing />
		<FormInput
			className={inputClassname}
			disabled={disabled}
			id={id}
			inputRef={inputRef}
			max={max}
			min={min}
			placeholder={placeholder}
			type={type}
		/>
	</>
);

export default FormInputLabel;
