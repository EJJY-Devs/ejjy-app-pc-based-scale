import { DEFAULT_PAGE, useBranches } from 'ejjy-global';
import { useHistory } from 'react-router-dom';

const PAGE_SIZE = 1;
const NETWORK_RETRY = 10;
const NETWORK_RETRY_DELAY_MS = 1000;

const useNetwork = (branchServerURL?: string) => {
	const history = useHistory();

	return useBranches({
		params: {
			page: DEFAULT_PAGE,
			pageSize: PAGE_SIZE,
		},
		options: {
			enabled: !!branchServerURL,
			refetchOnWindowFocus: false,
			retry: NETWORK_RETRY,
			retryDelay: NETWORK_RETRY_DELAY_MS,
			onError: () => {
				history.push({
					pathname: 'error',
					state: true,
				});
			},
		},
	});
};

export default useNetwork;
