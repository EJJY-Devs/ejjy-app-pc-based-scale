import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/branch-products';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchProducts = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// SELECTORS
	const branchProducts = useSelector(selectors.selectBranchProducts());

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
		branchProducts,
		listBranchProducts,
		status,
		errors,
	};
};
