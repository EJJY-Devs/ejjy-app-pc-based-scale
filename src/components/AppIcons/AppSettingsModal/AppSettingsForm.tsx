import { Col, Divider, Input, Radio, Row, Select, Slider, Space } from 'antd';
import {
	FieldError,
	filterOption,
	useBranches,
	useBranchMachines,
} from 'ejjy-global';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { getBranchServerUrl } from 'utils/function';
import * as Yup from 'yup';
import { Button, Label } from '../../elements';

export interface FormData {
	branchId: number;
	branchMachine: string;
	branchMachineId: number;
	branchName: string;
	branchServerUrl: string;
	brightness: string;
	companyName: string;
	priceCodeFeature: string | number;
}

interface Props extends FormData {
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
}

export const AppSettingsForm = ({
	branchId,
	branchMachine,
	branchMachineId,
	branchName,
	branchServerUrl,
	brightness,
	companyName,
	priceCodeFeature,
	onClose,
	onSubmit,
}: Props) => {
	// STATES
	const [selectedBranchId, setSelectedBranchId] = useState(branchId);

	// CUSTOM HOOKS
	const { data: branchesData, isFetching: isFetchingBranches } = useBranches({
		serviceOptions: {
			baseURL: getBranchServerUrl(),
		},
	});
	const { data: branchMachinesData, isFetching: isFetchingBranchMachines } =
		useBranchMachines({
			params: {
				branchId: selectedBranchId ?? undefined,
			},
			serviceOptions: {
				baseURL: getBranchServerUrl(),
			},
		});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId,
				branchMachine: branchMachine || '',
				branchMachineId,
				branchName: branchName || '',
				branchServerUrl: branchServerUrl || '',
				brightness: brightness || '100',
				companyName: companyName || '',
				priceCodeFeature: priceCodeFeature || '0',
			},
			Schema: Yup.object().shape({
				branchId: Yup.string().required().label('Branch ID'),
				branchMachineId: Yup.string().required().label('Branch Machine ID'),
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
		<Formik<FormData>
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (formData) => {
				onSubmit(formData);
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
								render={(error) => <FieldError message={error} />}
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
								render={(error) => <FieldError message={error} />}
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
								render={(error) => <FieldError message={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="branchId" label="Branch" spacing />
							<Select
								className="w-full"
								filterOption={filterOption}
								loading={isFetchingBranches}
								optionFilterProp="children"
								value={values.branchId}
								allowClear
								showSearch
								onChange={(value) => {
									setFieldValue('branchId', value);
									setSelectedBranchId(Number(value));
								}}
							>
								{branchesData?.list?.map((branch) => (
									<Select.Option key={branch.id} value={branch.id}>
										{branch.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="branchId"
								render={(error) => <FieldError message={error} />}
							/>
						</Col>

						{values.branchId && (
							<Col span={24}>
								<Label id="branchMachineId" label="Branch Machine" spacing />
								<Select
									className="w-full"
									filterOption={filterOption}
									loading={isFetchingBranchMachines}
									optionFilterProp="children"
									value={values.branchMachineId}
									allowClear
									showSearch
									onChange={(value) => {
										setFieldValue('branchMachineId', value);

										const selectedBranchMachine =
											branchMachinesData?.list?.find((bm) => bm.id === value);
										if (selectedBranchMachine) {
											setFieldValue(
												'branchMachine',
												JSON.stringify(selectedBranchMachine),
											);
										}
									}}
								>
									{branchMachinesData?.list?.map((bm) => (
										<Select.Option key={bm.id} value={bm.id}>
											{bm.name}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="branchMachineId"
									render={(error) => <FieldError message={error} />}
								/>
							</Col>
						)}

						<Col span={24}>
							<Label label="Brightness" spacing />
							<Slider
								max={100}
								min={10}
								step={5}
								tipFormatter={(value) => `${value}%`}
								value={Number(values.brightness)}
								onChange={(value) => {
									setFieldValue('brightness', value);
									handleChangeSlider(value);
								}}
							/>

							<ErrorMessage
								name="brightness"
								render={(error) => <FieldError message={error} />}
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
								render={(error) => <FieldError message={error} />}
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
