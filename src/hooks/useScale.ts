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

	const counter = useRef(0);
	const refetchInterval = useRef(REFETCH_INTERVAL_SHORT_MS);
	const dateInactive = useRef<dayjs.Dayjs | null>(null);
	const virtualWeightRef = useRef(weight || 0); // Use a ref to store the virtual weight

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
					// Update the virtual weight with increments of 0.1
					const newWeight = parseFloat(data);

					if (newWeight > virtualWeightRef.current + 0.1) {
						virtualWeightRef.current += 0.1; // Increment by 0.1
					} else if (newWeight < virtualWeightRef.current) {
						virtualWeightRef.current = newWeight; // Adjust down to actual weight
					}

					// Update weight in store
					setWeight(virtualWeightRef.current);

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
				// Optional: Update weight here if needed
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
