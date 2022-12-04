import { message, Modal } from 'antd';
import {
	APP_BRANCH_NAME_KEY,
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
	APP_COMPANY_NAME_KEY,
	APP_PRICE_CODE_FEATURE_KEY,
} from 'global';
import React from 'react';
import {
	getAppBrightness,
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
	const handleSubmit = (data) => {
		localStorage.setItem(APP_BRANCH_NAME_KEY, data.branchName);
		localStorage.setItem(APP_BRANCH_SERVER_URL_KEY, data.branchServerUrl);
		localStorage.setItem(APP_BRIGHTNESS_KEY, data.brightness);
		localStorage.setItem(APP_COMPANY_NAME_KEY, data.companyName);
		localStorage.setItem(APP_PRICE_CODE_FEATURE_KEY, data.priceCodeFeature);

		message.success('Successfully updated the app settings.');
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
