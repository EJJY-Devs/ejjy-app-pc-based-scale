import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { BranchesService } from 'services';
import { getBranchServerUrl } from 'utils/function';

const useBranches = ({ params, options }: Query = {}) =>
	useQuery<any>(
		['useBranches', params?.page, params?.pageSize],
		() =>
			wrapServiceWithCatch(
				BranchesService.list(
					{
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
					},
					getBranchServerUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branches: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useBranches;
