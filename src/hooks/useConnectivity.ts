import {
	ConnectivityLogsService,
	connectivityTypes,
	REFETCH_SYNC_INTERVAL_MS,
	SiteSettingsService,
} from 'ejjy-global';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { getBranchMachineId, getBranchServerUrl } from '../utils/function';

const useConnectivity = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const isConnected = useRef(null);

	useQuery(
		['useConnectivity', isEnabled],
		() => SiteSettingsService.retrieve(null, getBranchServerUrl()),
		{
			enabled: isEnabled,
			refetchInterval: REFETCH_SYNC_INTERVAL_MS,
			refetchOnWindowFocus: false,
			retry: false,
			onSettled: (_data, error) => {
				const isConnectedNew = !error;

				if (isConnected.current === null) {
					isConnected.current = isConnectedNew;
				} else if (isConnected.current !== isConnectedNew) {
					isConnected.current = isConnectedNew;

					ConnectivityLogsService.create({
						branch_machine_id: Number(getBranchMachineId()),
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
