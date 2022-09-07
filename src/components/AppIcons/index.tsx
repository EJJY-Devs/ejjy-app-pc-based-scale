import { WifiOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React from 'react';
import { useConnectivity } from '../../hooks/useConnectivity';
import './style.scss';

export const Component = () => {
	// STATES
	const { isConnected } = useConnectivity();

	// METHODS
	const handleConnectionClick = () => {
		window.location.reload();
	};

	return (
		<div className="AppIcons">
			<WifiOutlined
				className={cn('AppIcons_icon', {
					'AppIcons_icon--warning': isConnected === null,
					'AppIcons_icon--success': isConnected === true,
					'AppIcons_icon--error': isConnected === false,
				})}
				onClick={handleConnectionClick}
			/>
		</div>
	);
};

export const AppIcons = React.memo(Component);
