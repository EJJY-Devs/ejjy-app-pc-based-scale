import { Input } from 'antd';
import { FieldError } from 'ejjy-global';
import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { Button, Label } from '../elements';

const FormDetails = {
	DefaultValues: {
		username: '',
		password: '',
	},
	Schema: Yup.object().shape({
		username: Yup.string().required().label('Username'),
		password: Yup.string().required().label('Password'),
	}),
};

export type FormData = {
	username: string;
	password: string;
};

type Props = {
	isManager?: boolean;
	loading: boolean;
	submitText: string;
	onSubmit: (formData: FormData, resetForm: () => void) => void;
};

export const AuthForm = ({
	isManager,
	loading,
	submitText,
	onSubmit,
}: Props) => {
	return (
		<Formik<FormData>
			initialValues={FormDetails.DefaultValues}
			validationSchema={FormDetails.Schema}
			onSubmit={async (formData, { resetForm }) => {
				onSubmit(formData, resetForm);
			}}
		>
			{({ values, setFieldValue }) => (
				<Form className="w-full">
					<div className="mb-8 w-full">
						<Label label={`${isManager ? "Manager's" : ''} Username`} spacing />
						<Input
							value={values.username}
							onChange={(e) => {
								setFieldValue('username', e.target.value);
							}}
						/>
						<ErrorMessage
							name="username"
							render={(error) => <FieldError message={error} />}
						/>
					</div>

					<div className="mb-8 w-full">
						<Label label={`${isManager ? "Manager's" : ''} Password`} spacing />
						<Input
							type="password"
							value={values.password}
							onChange={(e) => {
								setFieldValue('password', e.target.value);
							}}
						/>
						<ErrorMessage
							name="password"
							render={(error) => <FieldError message={error} />}
						/>
					</div>

					<Button
						loading={loading}
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
