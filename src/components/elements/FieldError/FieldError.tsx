import { CloseCircleOutlined } from '@ant-design/icons';
import { FormikErrors } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	error: string | FormikErrors<any> | string[] | FormikErrors<any>[];
}

const FieldError = ({ error }: Props) => (
	<div className="FieldError">
		<CloseCircleOutlined className="FieldError_icon" />
		<span className="FieldError_text">{error}</span>
	</div>
);

export default FieldError;
