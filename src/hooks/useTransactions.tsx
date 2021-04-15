import { useState } from 'react';
import { actions, types } from '../ducks/transactions';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useTransactions = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const createTransactionAction = useActionDispatch(actions.createTransaction);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const createTransaction = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_TRANSACTION);

		createTransactionAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		createTransaction,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
