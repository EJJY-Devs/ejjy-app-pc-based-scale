import { useState } from 'react';
import { actions } from '../ducks/transactions';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useTransactions = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// ACTIONS
	const createTransactionAction = useActionDispatch(actions.createTransaction);

	// METHODS
	const createTransaction = (data, extraCallback = null) => {
		createTransactionAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	return {
		createTransaction,
		status,
		errors,
	};
};
