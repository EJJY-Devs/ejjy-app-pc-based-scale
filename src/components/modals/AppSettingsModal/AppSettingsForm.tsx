import { Col, Divider, Input, Radio, Row, Select, Space } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranches, useBranchMachines } from 'hooks';
import React, { useCallback, useState } from 'react';
import { filterOption } from 'utils/function';
import * as Yup from 'yup';
import { Button, FieldError, FormSlider, Label } from '../../elements';

interface Props {
	branchId: number;
	branchMachine: string;
	branchMachineId: number;
	branchName: string;
	branchServerUrl: string;
	brightness: string;
	companyName: string;
	onClose: any;
	onSubmit: any;
	priceCodeFeature: string | number;
}

export const AppSettingsForm = ({
	branchId,
	branchMachine,
	branchMachineId,
	branchName,
	branchServerUrl,
	brightness,
	companyName,
	onClose,
	onSubmit,
	priceCodeFeature,
}: Props) => {
	// STATES
	const [selectedBranchId, setSelectedBranchId] = useState(branchId);

	// CUSTOM HOOKS
	const {
		isFetching: isFetchingBranches,
		data: { branches },
	} = useBranches();
	const {
		isFetching: isFetchingBranchMachines,
		data: { branchMachines },
	} = useBranchMachines({
		params: { branchId: selectedBranchId },
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId: branchId || '',
				branchMachine: branchMachine || '',
				branchMachineId: branchMachineId || '',
				branchName: branchName || '',
				branchServerUrl: branchServerUrl || '',
				brightness: brightness || 100,
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
							<Label id="branchId" label="Branch" spacing />
							<Select
								className="w-100"
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
								{branches.map((branch) => (
									<Select.Option key={branch.id} value={branch.id}>
										{branch.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="branchId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{values.branchId && (
							<Col span={24}>
								<Label id="branchMachineId" label="Branch Machine" spacing />
								<Select
									className="w-100"
									filterOption={filterOption}
									loading={isFetchingBranchMachines}
									optionFilterProp="children"
									value={values.branchMachineId}
									allowClear
									showSearch
									onChange={(value) => {
										setFieldValue('branchMachineId', value);

										const selectedBranchMachine = branchMachines.find(
											(bm) => bm.id === value,
										);
										if (selectedBranchMachine) {
											setFieldValue(
												'branchMachine',
												JSON.stringify(selectedBranchMachine),
											);
										}
									}}
								>
									{branchMachines.map((bm) => (
										<Select.Option key={bm.id} value={bm.id}>
											{bm.name}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="branchMachineId"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}

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
