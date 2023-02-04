import { message, Modal } from 'antd';
import {
	APP_BRANCH_ID_KEY,
	APP_BRANCH_MACHINE_ID_KEY,
	APP_BRANCH_MACHINE_KEY,
	APP_BRANCH_NAME_KEY,
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
	APP_COMPANY_NAME_KEY,
	APP_PRICE_CODE_FEATURE_KEY,
} from 'global';
import React from 'react';
import {
	getAppBrightness,
	getBranchId,
	getBranchMachine,
	getBranchMachineId,
	getBranchName,
	getBranchServerUrl,
	getCompanyName,
	getPriceCodeFeature,
} from 'utils/function';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onClose: any;
}

export const AppSettingsModal = ({ onClose }: Props) => {
	const handleSubmit = (formData) => {
		localStorage.setItem(APP_BRANCH_ID_KEY, formData.branchId);
		localStorage.setItem(APP_BRANCH_MACHINE_ID_KEY, formData.branchMachineId);
		localStorage.setItem(APP_BRANCH_MACHINE_KEY, formData.branchMachine);
		localStorage.setItem(APP_BRANCH_NAME_KEY, formData.branchName);
		localStorage.setItem(APP_BRANCH_SERVER_URL_KEY, formData.branchServerUrl);
		localStorage.setItem(APP_BRIGHTNESS_KEY, formData.brightness);
		localStorage.setItem(APP_COMPANY_NAME_KEY, formData.companyName);
		localStorage.setItem(APP_PRICE_CODE_FEATURE_KEY, formData.priceCodeFeature);

		message.success('App settings were updated successfully');
		handleClose();
	};

	const handleClose = () => {
		document.querySelector(
			'html',
		).style.filter = `brightness(${getAppBrightness()}%)`;
		onClose();
	};

	return (
		<Modal
			footer={null}
			title="App Settings"
			centered
			closable
			visible
			onCancel={handleClose}
		>
			<AppSettingsForm
				branchId={Number(getBranchId())}
				branchMachine={getBranchMachine()}
				branchMachineId={Number(getBranchMachineId())}
				branchName={getBranchName()}
				branchServerUrl={getBranchServerUrl()}
				brightness={getAppBrightness()}
				companyName={getCompanyName()}
				priceCodeFeature={getPriceCodeFeature()}
				onClose={handleClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
