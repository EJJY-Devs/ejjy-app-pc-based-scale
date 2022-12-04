import { wrapServiceWithCatch } from 'hooks/helper';
import { useMutation, useQuery } from 'react-query';
import { ScaleService } from 'services';
import { useWeightStore } from 'stores';

const REFETCH_INTERVAL_MS = 10;

export const useWeight = () => {
	const setWeight = useWeightStore((state: any) => state.setWeight);

	return useQuery<any>(
		['useWeight'],
		async () => wrapServiceWithCatch(ScaleService.retrieveWeight()),
		{
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: [],
			onSuccess: ({ data }) => {
				setWeight({ weight: data });
			},
		},
	);
};

export const useTare = () => useMutation(() => ScaleService.tare());

export const useZero = () => useMutation(() => ScaleService.zero());

export const usePrintProduct = () =>
	useMutation<any, any, any>(
		({ name, branch, code, price, totalPrice, weight }: any) =>
			ScaleService.printProduct({
				name,
				branch,
				code,
				price,
				totalPrice,
				weight,
			}),
	);

export const usePrintTransaction = () =>
	useMutation<any, any, any>(({ branch, totalPrice, transactionId }: any) =>
		ScaleService.printTransaction({
			branch,
			totalPrice,
			transactionId,
		}),
	);

export const usePrintTotal = () =>
	useMutation<any, any, any>(({ branchName, companyName, totalPrice }: any) =>
		ScaleService.printTotal({
			branchName,
			companyName,
			totalPrice,
		}),
	);
