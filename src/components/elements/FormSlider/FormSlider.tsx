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

	const handleChangeSlider = (value) => {
		helpers.setValue(value);

		if (onChange) {
			onChange(value);
		}
	};

	const formatter = (value) => `${value}%`;

	return (
		<Slider
			className={className}
			max={100}
			min={10}
			step={5}
			tipFormatter={formatter}
			value={field.value}
			onChange={handleChangeSlider}
		/>
	);
};

export default FormSlider;
