import React from 'react';
import { useConnectivity } from '../../hooks/useConnectivity';
import './style.scss';

export const Connectivity = () => {
	const { isConnected } = useConnectivity();

	return isConnected !== null ? (
		<div className="Connectivity">
			{isConnected ? (
				<img
					src={require('../../assets/images/server-connected.png')}
					alt="connectivity-icon"
				/>
			) : (
				<img
					src={require('../../assets/images/server-not-connected.png')}
					alt="connectivity-icon"
				/>
			)}
		</div>
	) : null;
};
