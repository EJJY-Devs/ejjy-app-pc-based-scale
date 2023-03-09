import dayjs from 'dayjs';
import { wrapServiceWithCatch } from 'hooks/helper';
import { useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { ScaleService } from 'services';
import { useWeightStore } from 'stores';

const REFETCH_INTERVAL_SHORT_MS = 10;
const REFETCH_INTERVAL_LONG_MS = 1000;

const THRESHOLD_LENGTH_MS = 5000;
const THRESHOLD_LENGTH = THRESHOLD_LENGTH_MS / REFETCH_INTERVAL_SHORT_MS;

const INACTIVE_MINUTES = 10;

export const useWeight = () => {
	const history = useHistory();
	const setWeight = useWeightStore((state: any) => state.setWeight);

	const counter = useRef(0);
	const previousValue = useRef(0);
	const refetchInterval = useRef(REFETCH_INTERVAL_SHORT_MS);
	const dateInactive = useRef(null);

	return useQuery<any>(
		'useWeight',
		async () => {
			const response = await wrapServiceWithCatch(
				ScaleService.retrieveWeight(),
			);

			if (response) {
				counter.current += 1;

				const { data } = response;

				if (
					previousValue.current === data &&
					counter.current > THRESHOLD_LENGTH
				) {
					refetchInterval.current = REFETCH_INTERVAL_LONG_MS;

					if (dateInactive.current === null) {
						dateInactive.current = dayjs();
					} else if (
						dayjs().diff(dateInactive.current, 'minute') >= INACTIVE_MINUTES
					) {
						history.push({
							pathname: 'inactive',
							state: true,
						});
					}
				}

				if (previousValue.current !== data) {
					previousValue.current = data;
					counter.current = 0;
					refetchInterval.current = REFETCH_INTERVAL_SHORT_MS;
					dateInactive.current = null;
				}
			}

			return response;
		},
		{
			refetchInterval: () => refetchInterval.current,
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
		({ name, branchName, code, companyName, price, totalPrice, weight }: any) =>
			ScaleService.printProduct({
				branchName,
				code,
				companyName,
				name,
				price,
				totalPrice,
				weight,
			}),
	);

export const usePrintTransaction = () =>
	useMutation<any, any, any>(
		({ branchName, companyName, totalPrice, transactionId }: any) =>
			ScaleService.printTransaction({
				branchName,
				companyName,
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
