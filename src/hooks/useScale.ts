import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { wrapServiceWithCatch } from 'ejjy-global';
import { AxiosErrorResponse } from 'ejjy-global/dist/services/interfaces';
import { useRef, useState } from 'react';
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

const REFETCH_INTERVAL_SHORT_MS = 5;
const REFETCH_INTERVAL_LONG_MS = 1000;

const THRESHOLD_LENGTH_MS = 5000;
const THRESHOLD_LENGTH = THRESHOLD_LENGTH_MS / REFETCH_INTERVAL_SHORT_MS;

const INACTIVE_MINUTES = 10;

export const useWeight = () => {
	const history = useHistory();
	const { setWeight, weight } = useWeightStore();
	const [virtualWeight, setVirtualWeight] = useState(weight); // Store virtual weight

	console.log(weight, virtualWeight);

	const counter = useRef(0);
	const refetchInterval = useRef(REFETCH_INTERVAL_SHORT_MS);
	const dateInactive = useRef<dayjs.Dayjs | null>(null);

	return useQuery<number>(
		'useWeight',
		async () => {
			const response = await wrapServiceWithCatch(
				ScaleService.retrieveWeight(),
			);

			if (response) {
				const { data } = response;

				if (data === 0) {
					counter.current += 1;

					if (counter.current > THRESHOLD_LENGTH) {
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
				} else {
					// Update the virtual weight smoothly
					setVirtualWeight((prevWeight) => {
						// Calculate new virtual weight
						let newWeight = Math.round(data * 10) / 10; // Keep it to 1 decimal place
						if (newWeight > prevWeight + 0.5) {
							return prevWeight + 0.5; // Prevent jumps larger than 0.5
						} else if (newWeight < prevWeight) {
							return newWeight; // Adjust down to actual weight
						}
						return prevWeight; // No change
					});

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
