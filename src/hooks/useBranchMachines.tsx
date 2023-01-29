import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { BranchMachinesService } from 'services';
import { getBranchServerUrl } from 'utils/function';

const useBranchMachines = ({ params, options }: Query) =>
	useQuery<any>(
		['useBranchMachines', params?.branchId],
		() =>
			wrapServiceWithCatch(
				BranchMachinesService.list(
					{ branch_id: params?.branchId },
					getBranchServerUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchMachines: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export const useBranchMachinePing = () =>
	useMutation<any, any, any>(({ id }: any) =>
		BranchMachinesService.ping(
			{
				online_branch_machine_id: id,
				online_api_url_override: getBranchServerUrl(),
			},
			getBranchServerUrl(),
		),
	);

export default useBranchMachines;
