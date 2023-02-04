import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { connectivityTypes } from '../global/types';
import { ConnectivityLogsService, SiteSettingsService } from '../services';
import { getBranchServerUrl } from '../utils/function';

const useConnectivity = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const isConnected = useRef(null);

	useQuery(
		['useConnectivity', isEnabled],
		() => SiteSettingsService.get(getBranchServerUrl()),
		{
			enabled: isEnabled,
			refetchInterval: 60000,
			refetchOnWindowFocus: false,
			retry: false,
			select: (query) => query.data,
			onSettled: (_data, error) => {
				const isConnectedNew = !error;

				if (isConnected.current === null) {
					isConnected.current = isConnectedNew;
				} else if (isConnected.current !== isConnectedNew) {
					isConnected.current = isConnectedNew;

					ConnectivityLogsService.create({
						type: isConnectedNew
							? connectivityTypes.OFFLINE_TO_ONLINE
							: connectivityTypes.ONLINE_TO_OFFLINE,
					});
				}
			},
		},
	);

	useEffect(() => {
		if (getBranchServerUrl()) {
			setIsEnabled(true);
		}
	}, []);

	return {
		isConnected: isConnected.current,
	};
};

export default useConnectivity;
