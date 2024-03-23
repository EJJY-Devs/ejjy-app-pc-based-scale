import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { AxiosErrorResponse } from 'ejjy-global/dist/services/interfaces';
import { wrapServiceWithCatch } from 'hooks/helper';
import { useRef } from 'react';
import { UseMutationOptions, useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { ScaleService } from 'services';
import {
	PrintProduct,
	PrintTotal,
	PrintTransaction,
} from 'services/ScaleService';
import { useWeightStore } from 'stores';
import { CamelCasedProperties } from 'type-fest';

const REFETCH_INTERVAL_SHORT_MS = 10;
const REFETCH_INTERVAL_LONG_MS = 1000;

const THRESHOLD_LENGTH_MS = 5000;
const THRESHOLD_LENGTH = THRESHOLD_LENGTH_MS / REFETCH_INTERVAL_SHORT_MS;

const INACTIVE_MINUTES = 10;

export const useWeight = () => {
	const history = useHistory();
	const { setWeight } = useWeightStore();

	const counter = useRef(0);
	const previousValue = useRef(0);
	const refetchInterval = useRef(REFETCH_INTERVAL_SHORT_MS);
	const dateInactive = useRef(null);

	return useQuery<number>(
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
			onSuccess: (newWeight) => {
				setWeight(newWeight);
			},
		},
	);
};

export const useTare = () =>
	useMutation<AxiosResponse<boolean>, AxiosErrorResponse>(() =>
		ScaleService.tare(),
	);

export const useZero = () =>
	useMutation<AxiosResponse<boolean>, AxiosErrorResponse>(() =>
		ScaleService.zero(),
	);

export const usePrintProduct = (
	options?: UseMutationOptions<
		AxiosResponse<boolean>,
		AxiosErrorResponse,
		CamelCasedProperties<PrintProduct>
	>,
) =>
	useMutation<
		AxiosResponse<boolean>,
		AxiosErrorResponse,
		CamelCasedProperties<PrintProduct>
	>(
		({ name, branchName, code, companyName, price, totalPrice, weight }) =>
			ScaleService.printProduct({
				branchName,
				code,
				companyName,
				name,
				price,
				totalPrice,
				weight,
			}),
		options,
	);

export const usePrintTransaction = () =>
	useMutation<
		AxiosResponse<boolean>,
		AxiosErrorResponse,
		CamelCasedProperties<PrintTransaction>
	>(({ branchName, companyName, totalPrice, transactionId }) =>
		ScaleService.printTransaction({
			branchName,
			companyName,
			totalPrice,
			transactionId,
		}),
	);

export const usePrintTotal = () =>
	useMutation<
		AxiosResponse<boolean>,
		AxiosErrorResponse,
		CamelCasedProperties<PrintTotal>
	>(({ branchName, companyName, totalPrice }) =>
		ScaleService.printTotal({
			branchName,
			companyName,
			totalPrice,
		}),
	);
