import React from 'react';
import { useConnectivity } from '../../hooks/useConnectivity';
import './style.scss';

export const Connectivity = () => {
	const { isConnected } = useConnectivity();

	return isConnected !== null ? (
		<div className="Connectivity">
			{isConnected ? (
				<img
					alt="connectivity-icon"
					src={require('../../assets/images/server-connected.png')}
				/>
			) : (
				<img
					alt="connectivity-icon"
					src={require('../../assets/images/server-not-connected.png')}
				/>
			)}
		</div>
	) : null;
};
