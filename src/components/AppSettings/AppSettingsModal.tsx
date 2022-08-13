import { message, Modal } from 'antd';
import React from 'react';
import {
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
	APP_PRICE_CODE_FEATURE_KEY,
} from '../../global/constants';
import {
	getAppBrightness,
	getBranchServerUrl,
	getPriceCodeFeature,
} from '../../utils/function';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onClose: any;
}

export const AppSettingsModal = ({ onClose }: Props) => {
	const handleSubmit = (data) => {
		localStorage.setItem(APP_BRANCH_SERVER_URL_KEY, data.branchServerUrl);
		localStorage.setItem(APP_BRIGHTNESS_KEY, data.brightness);
		localStorage.setItem(APP_PRICE_CODE_FEATURE_KEY, data.priceCodeFeature);

		message.success('Successfully updated the app settings.');
		close();
	};

	const close = () => {
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
			onCancel={close}
		>
			<AppSettingsForm
				branchServerUrl={getBranchServerUrl()}
				brightness={getAppBrightness()}
				priceCodeFeature={getPriceCodeFeature()}
				onClose={close}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
