import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/pc';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const usePc = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const weight = useSelector(selectors.selectWeight());

	const getWeightAction = useActionDispatch(actions.getWeight);

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

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		weight,
		getWeight,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
