import { SettingOutlined, WifiOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import cn from 'classnames';
import { useConnectivity } from 'hooks';
import React, { useEffect, useState } from 'react';
import { getBranchServerUrl } from 'utils/function';
import { AppSettingsModal } from './AppSettingsModal';
import './style.scss';

export const Component = () => {
	// STATES
	const { isConnected } = useConnectivity();
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);

	// METHODS
	useEffect(() => {
		setAppSettingsModalVisible(!getBranchServerUrl());
	}, []);

	const handleConnectionClick = () => {
		window.location.reload();
	};

	const handleAppSettingsClick = () => {
		setAppSettingsModalVisible(true);
	};

	return (
		<>
			<div className="AppIcons">
				<Tooltip title="Connectivity Status">
					<WifiOutlined
						className={cn('AppIcons_icon', {
							'AppIcons_icon--warning': isConnected === null,
							'AppIcons_icon--success': isConnected === true,
							'AppIcons_icon--error': isConnected === false,
						})}
						onClick={handleConnectionClick}
					/>
				</Tooltip>
				<Tooltip title="App Settings">
					<SettingOutlined
						className="AppIcons_icon AppIcons_icon--info"
						onClick={handleAppSettingsClick}
					/>
				</Tooltip>
			</div>

			{appSettingsModalVisible && (
				<AppSettingsModal onClose={() => setAppSettingsModalVisible(false)} />
			)}
		</>
	);
};

export const AppIcons = React.memo(Component);
