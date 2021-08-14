import { Slider } from 'antd';
import { useField } from 'formik';
import * as React from 'react';

interface Props {
	id?: string;
	className?: string;
	onChange?: any;
}

const FormSlider = ({ id, className, onChange }: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [field, , helpers] = useField(id);

	const onChangeSlider = (value) => {
		helpers.setValue(value);

		if (onChange) {
			onChange(value);
		}
	};

	const formatter = (value) => `${value}%`;

	return (
		<Slider
			className={className}
			tipFormatter={formatter}
			step={5}
			min={10}
			max={100}
			value={field.value}
			onChange={onChangeSlider}
		/>
	);
};

export default FormSlider;
