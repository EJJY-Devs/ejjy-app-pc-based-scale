import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/pc';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const usePc = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// SELECTORS
	const weight = useSelector(selectors.selectWeight());

	// ACTIONS
	const getWeightAction = useActionDispatch(actions.getWeight);
	const recalibrateAction = useActionDispatch(actions.recalibrate);
	const printProductAction = useActionDispatch(actions.printProduct);
	const printTransactionAction = useActionDispatch(actions.printTransaction);
	const resetWeight = useActionDispatch(actions.resetWeight);

	// METHODS
	const getWeight = () => {
		getWeightAction();
	};

	const printProduct = (data, extraCallback = null) => {
		printProductAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const printTransaction = (data, extraCallback = null) => {
		printTransactionAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const recalibrate = (extraCallback = null) => {
		recalibrateAction({
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
		weight,
		recalibrate,
		resetWeight,
		getWeight,
		printProduct,
		printTransaction,
		status,
		errors,
	};
};
