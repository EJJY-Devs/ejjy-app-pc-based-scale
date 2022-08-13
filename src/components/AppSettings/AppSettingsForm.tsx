import { Col, Divider, Radio, Row, Space } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback } from 'react';
import * as Yup from 'yup';
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
	priceCodeFeature: string | number;
	onSubmit: any;
	onClose: any;
}

export const AppSettingsForm = ({
	branchServerUrl,
	brightness,
	priceCodeFeature,
	onSubmit,
	onClose,
}: Props) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchServerUrl: branchServerUrl || '',
				brightness: brightness || 100,
				priceCodeFeature: priceCodeFeature || '0',
			},
			Schema: Yup.object().shape({
				branchServerUrl: Yup.string().required().label('Branch Server URL'),
				brightness: Yup.string().required().label('Brightness'),
				priceCodeFeature: Yup.string().required().label('Price Code Feature'),
			}),
		}),
		[branchServerUrl, brightness],
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
								size="large"
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
