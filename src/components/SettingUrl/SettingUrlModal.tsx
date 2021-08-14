import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import {
	APP_BRIGHTNESS_KEY,
	LOCAL_SERVER_URL_KEY,
} from '../../global/constants';
import { getAppBrightness, getLocalServerUrl } from '../../utils/function';
import { SettingUrlForm } from './SettingUrlForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const SettingUrlModal = ({ visible, onClose }: Props) => {
	// STATES
	const [localServerUrl, setLocalServerUrl] = useState('');
	const [brightness, setBrightness] = useState(100);

	// METHODS
	useEffect(() => {
		if (visible) {
			setLocalServerUrl(getLocalServerUrl());
			setBrightness(Number(getAppBrightness()));
		}
	}, [visible]);

	const onSubmit = (data) => {
		localStorage.setItem(LOCAL_SERVER_URL_KEY, data.localServerUrl);
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
			title="App Settings Configuration"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable
		>
			<SettingUrlForm
				localServerUrl={localServerUrl}
				brightness={brightness}
				onSubmit={onSubmit}
				onClose={close}
			/>
		</Modal>
	);
};
