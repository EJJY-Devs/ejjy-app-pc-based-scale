import { useQuery } from 'react-query';
import { SiteSettingsService } from '../services';

const useSiteSettings = ({ refetchInterval = null } = {}) =>
	useQuery<any>(
		'useSiteSettings',
		() => SiteSettingsService.get().catch((e) => Promise.reject(e.errors)),
		{
			refetchInterval,
			staleTime: 0,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			retry: false,
			notifyOnChangeProps: ['data'],
			select: (query) => query.data,
		},
	);

export default useSiteSettings;
