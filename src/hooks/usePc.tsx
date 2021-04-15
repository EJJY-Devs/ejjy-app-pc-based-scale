import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/pc';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const usePc = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const weight = useSelector(selectors.selectWeight());

	const getWeightAction = useActionDispatch(actions.getWeight);
	const printProductAction = useActionDispatch(actions.printProduct);
	const printTransactionAction = useActionDispatch(actions.printTransaction);
	const resetWeight = useActionDispatch(actions.resetWeight);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getWeight = () => {
		setRecentRequest(types.GET_WEIGHT);
		getWeightAction();
	};

	const printProduct = (data, extraCallback = null) => {
		setRecentRequest(types.PRINT_PRODUCT);
		printProductAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const printTransaction = (data, extraCallback = null) => {
		setRecentRequest(types.PRINT_TRANSACTION);
		printTransactionAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		weight,
		resetWeight,
		getWeight,
		printProduct,
		printTransaction,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
