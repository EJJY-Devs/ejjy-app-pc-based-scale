import { useQuery } from 'react-query';
import { DataService } from 'services';

export const useInitializeData = () =>
	useQuery(
		['useInitializeData'],
		() => DataService.initialize().catch((e) => Promise.reject(e.errors)),
		{
			notifyOnChangeProps: [],
		},
	);
