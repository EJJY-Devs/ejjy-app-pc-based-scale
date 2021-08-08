import { useState } from 'react';
import { actions } from '../ducks/branch-products';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchProducts = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// ACTIONS
	const listBranchProductsAction = useActionDispatch(
		actions.listBranchProducts,
	);

	// METHODS
	const listBranchProducts = (data, extraCallback = null) => {
		listBranchProductsAction({
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
		listBranchProducts,
		status,
		errors,
	};
};
