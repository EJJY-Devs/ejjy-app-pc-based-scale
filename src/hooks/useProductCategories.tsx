import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/product-categories';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useProductCategories = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// SELECTORS
	const productCategories = useSelector(selectors.selectProductCategories());

	// ACTIONS
	const listProductCategoriesAction = useActionDispatch(
		actions.listProductCategories,
	);

	// METHODS
	const listProductCategories = (extraCallback = null) => {
		listProductCategoriesAction({
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
		productCategories,
		listProductCategories,
		status,
		errors,
	};
};
