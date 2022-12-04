import { Col, Divider, Input, Radio, Row, Space } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormSlider, Label } from '../elements';

interface Props {
	branchName: string;
	branchServerUrl: string;
	brightness: string;
	onClose: any;
	onSubmit: any;
	priceCodeFeature: string | number;
	companyName: string;
}

export const AppSettingsForm = ({
	branchName,
	branchServerUrl,
	brightness,
	companyName,
	onClose,
	onSubmit,
	priceCodeFeature,
}: Props) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchName: branchName || '',
				branchServerUrl: branchServerUrl || '',
				brightness: brightness || 100,
				companyName: companyName || '',
				priceCodeFeature: priceCodeFeature || '0',
			},
			Schema: Yup.object().shape({
				branchServerUrl: Yup.string().required().label('Branch Server URL'),
				brightness: Yup.string().required().label('Brightness'),
				companyName: Yup.string().required().label('Company Name'),
				priceCodeFeature: Yup.string().required().label('Price Code Feature'),
			}),
		}),
		[branchName, branchServerUrl, brightness, companyName],
	);

	const handleChangeSlider = (value) => {
		document.querySelector('html').style.filter = `brightness(${value}%)`;
	};

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (values) => {
				onSubmit(values);
			}}
		>
			{({ setFieldValue, values }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Branch Name" spacing />
							<Input
								value={values['branchName']}
								onChange={(e) => {
									setFieldValue('branchName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="branchName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Company Name" spacing />
							<Input
								value={values['companyName']}
								onChange={(e) => {
									setFieldValue('companyName', e.target.value);
								}}
							/>
							<ErrorMessage
								name="companyName"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Branch Server URL" spacing />
							<Input
								value={values['branchServerUrl']}
								onChange={(e) => {
									setFieldValue('branchServerUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="branchServerUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Brightness" spacing />
							<FormSlider id="brightness" onChange={handleChangeSlider} />
							<ErrorMessage
								name="brightness"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="priceCodeFeature" label="Price Code Feature" spacing />
							<Radio.Group
								buttonStyle="solid"
								options={[
									{ label: 'Enabled', value: '1' },
									{
										label: 'Disabled',
										value: '0',
									},
								]}
								optionType="button"
								value={values.priceCodeFeature}
								onChange={(e) => {
									setFieldValue('priceCodeFeature', e.target.value);
								}}
							/>
							<ErrorMessage
								name="priceCodeFeature"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<Divider />

					<Space style={{ width: '100%', justifyContent: 'center' }}>
						<Button size="lg" text="Cancel" type="button" onClick={onClose} />
						<Button size="lg" text="Submit" type="submit" variant="primary" />
					</Space>
				</Form>
			)}
		</Formik>
	);
};
