import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { SiteSettingsService } from 'services';

const useSiteSettings = ({ options }: Query = {}) =>
	useQuery<any>(
		'useSiteSettings',
		() => SiteSettingsService.get().catch((e) => Promise.reject(e.errors)),
		{
			staleTime: 0,
			refetchOnMount: false,
			notifyOnChangeProps: ['data'],
			select: (query) => query.data,
			...options,
		},
	);

export default useSiteSettings;
