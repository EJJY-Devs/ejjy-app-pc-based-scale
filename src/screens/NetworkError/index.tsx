import { Button, Result } from 'antd';
import { AppSettingsModal } from 'components';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getBranchServerUrl } from 'utils/function';
import './style.scss';

const NetworkError = () => {
	// STATES
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);

	// VARIABLES
	const branchServerURL = getBranchServerUrl();

	// CUSTOM HOOKS
	const history = useHistory();

	// METHODS
	useEffect(() => {
		if (!history.location.state) {
			history.replace('/');
		}
	}, [history]);

	return (
		<div className="NetworkError">
			<Result
				extra={[
					<Button
						key="reconnect"
						disabled={!branchServerURL}
						type="primary"
						onClick={() => history.push('/')}
					>
						Reconnect
					</Button>,
					<Button
						key="settings"
						onClick={() => setAppSettingsModalVisible(true)}
					>
						Edit App Settings
					</Button>,
				]}
				status="500"
				subTitle="Cannot connect to the server."
				title="Server Error"
			/>

			{appSettingsModalVisible && (
				<AppSettingsModal onClose={() => setAppSettingsModalVisible(false)} />
			)}
		</div>
	);
};

export default NetworkError;
