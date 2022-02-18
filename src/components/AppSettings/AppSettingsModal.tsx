import { message, Modal } from 'antd';
import React from 'react';
import {
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
} from '../../global/constants';
import { getAppBrightness, getBranchServerUrl } from '../../utils/function';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onClose: any;
}

export const AppSettingsModal = ({ onClose }: Props) => {
	const onSubmit = (data) => {
		localStorage.setItem(APP_BRANCH_SERVER_URL_KEY, data.branchServerUrl);
		localStorage.setItem(APP_BRIGHTNESS_KEY, data.brightness);

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
			title="App Settings"
			footer={null}
			onCancel={close}
			centered
			closable
			visible
		>
			<AppSettingsForm
				branchServerUrl={getBranchServerUrl()}
				brightness={getAppBrightness()}
				onSubmit={onSubmit}
				onClose={close}
			/>
		</Modal>
	);
};
