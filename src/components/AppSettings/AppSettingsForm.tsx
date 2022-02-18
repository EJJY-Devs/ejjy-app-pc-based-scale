import { Col, Divider, Row, Space } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { sleep } from '../../utils/function';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormSlider,
	Label,
} from '../elements';

interface Props {
	branchServerUrl: string;
	brightness: string;
	onSubmit: any;
	onClose: any;
}

export const AppSettingsForm = ({
	branchServerUrl,
	brightness,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchServerUrl: branchServerUrl || '',
				brightness: brightness || 100,
			},
			Schema: Yup.object().shape({
				branchServerUrl: Yup.string().required().label('Branch Server URL'),
				brightness: Yup.string().required().label('Brightness'),
			}),
		}),
		[branchServerUrl, brightness],
	);

	const onChangeSlider = (value) => {
		document.querySelector('html').style.filter = `brightness(${value}%)`;
	};

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
				resetForm();
			}}
			enableReinitialize
		>
			<Form>
				<Row gutter={[15, 15]}>
					<Col span={24}>
						<FormInputLabel id="branchServerUrl" label="Branch Server URL" />
						<ErrorMessage
							name="branchServerUrl"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col span={24}>
						<Label id="brightness" label="Brightness" spacing />
						<FormSlider id="brightness" onChange={onChangeSlider} />
						<ErrorMessage
							name="brightness"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<Divider />

				<Space style={{ width: '100%', justifyContent: 'center' }}>
					<Button
						type="button"
						text="Cancel"
						size="lg"
						onClick={onClose}
						disabled={isSubmitting}
					/>
					<Button
						type="submit"
						text="Submit"
						size="lg"
						variant="primary"
						loading={isSubmitting}
					/>
				</Space>
			</Form>
		</Formik>
	);
};
