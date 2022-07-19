import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { sleep } from '../../utils/function';
import { Button, FieldError, FormInputLabel } from '../elements';
import './style.scss';

const FormDetails = {
	DefaultValues: {
		login: '',
		password: '',
	},
	Schema: Yup.object().shape({
		login: Yup.string().required().label('Username'),
		password: Yup.string().required().label('Password'),
	}),
};

interface IAuthForm {
	submitText: string;
	onSubmit: any;
	loading: boolean;
	isManager?: boolean;
}

export const AuthForm = ({
	submitText,
	onSubmit,
	loading,
	isManager,
}: IAuthForm) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<Formik
			initialValues={FormDetails.DefaultValues}
			validationSchema={FormDetails.Schema}
			onSubmit={async (values, { resetForm }) => {
				setIsSubmitting(true);
				await sleep(500);
				setIsSubmitting(false);

				onSubmit(values, resetForm);
			}}
		>
			{({ errors, touched }) => (
				<Form className="AuthForm">
					<div className="AuthForm_inputField">
						<FormInputLabel
							id="login"
							label={`${isManager ? "Manager's" : ''} Username`}
						/>
						{errors.login && touched.login ? (
							<FieldError error={errors.login} />
						) : null}
					</div>

					<div className="AuthForm_inputField">
						<FormInputLabel
							id="password"
							label={`${isManager ? "Manager's" : ''} Password`}
							type="password"
						/>
						{errors.password && touched.password ? (
							<FieldError error={errors.password} />
						) : null}
					</div>

					<Button
						loading={loading || isSubmitting}
						text={submitText}
						type="submit"
						variant="secondary"
						block
					/>
				</Form>
			)}
		</Formik>
	);
};
