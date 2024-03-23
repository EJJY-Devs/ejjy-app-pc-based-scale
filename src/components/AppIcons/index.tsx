import { SettingOutlined, WifiOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { Tooltip } from 'antd';
import { cn } from 'utils';
import { useConnectivity } from 'hooks';
import React, { useEffect, useState } from 'react';
import { getBranchServerUrl } from 'utils/function';
import { AppSettingsModal } from './AppSettingsModal';

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
			<div className="fixed left-1 top-1 z-10 flex items-center gap-2">
				<TooltipIcon
					className={cn({
						'!text-orange-400': isConnected === null,
						'!text-green-500': isConnected === true,
						'!text-red-500': isConnected === false,
					})}
					Icon={WifiOutlined}
					title="Connectivity Status"
					onClick={handleConnectionClick}
				/>
				<TooltipIcon
					className="!text-blue-500"
					Icon={SettingOutlined}
					title="App Settings"
					onClick={handleAppSettingsClick}
				/>
			</div>

			{appSettingsModalVisible && (
				<AppSettingsModal onClose={() => setAppSettingsModalVisible(false)} />
			)}
		</>
	);
};

type TooltipIconProps = {
	title: string;
	className: string;
	Icon: React.ComponentType<AntdIconProps>;
	onClick: () => void;
};

const TooltipIcon = ({ title, Icon, className, onClick }: TooltipIconProps) => (
	<Tooltip title={title}>
		<Icon
			className={cn(
				'relative !flex h-10 w-10 items-center justify-center rounded-[50%] bg-white p-1 text-xl shadow',
				className,
			)}
			onClick={onClick}
		/>
	</Tooltip>
);

export const AppIcons = React.memo(Component);
